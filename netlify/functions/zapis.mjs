// Zapis na newsletter Psyche Waves: formularz strony -> ta funkcja -> Brevo (zapis z potwierdzeniem adresu, „double opt-in”).
// Dzięki temu na stronie nie ma żadnych skryptów ani plików cookie zewnętrznego narzędzia.
// Działa tylko dla psychewaves.pl. Wymagane zmienne środowiskowe (Netlify, projekt psychewaves.pl -> Environment variables):
//   BREVO_API_KEY            klucz API Brevo (sekretny)
//   BREVO_DOI_TEMPLATE_ID    numer szablonu wiadomości z linkiem potwierdzającym (typ „double opt-in”)
//   BREVO_LISTA_NEWSLETTER   numer listy „Newsletter Psyche Waves”
// Zob. CLAUDE.md, sekcja „Zapisy na newsletter (Brevo)”.

export const config = { path: '/api/zapis' };

const LISTA = { idEnv: 'BREVO_LISTA_NEWSLETTER', po: 'https://psychewaves.pl/zapis/potwierdzono-newsletter/' };

// Formularz może wysłać tylko własna strona (psychewaves.pl, podglądy jej projektu Netlify i lokalny podgląd).
const DOZWOLONE_HOSTY = [
  /^(www\.)?psychewaves\.pl$/,
  /^(.+--)?adorable-haupia-18a01f\.netlify\.app$/,
  /^localhost$/,
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const przekieruj = (req, sciezka) => Response.redirect(new URL(sciezka, req.url), 303);

function hostPochodzenia(req) {
  for (const naglowek of ['origin', 'referer']) {
    const wartosc = req.headers.get(naglowek);
    if (!wartosc) continue;
    try { return new URL(wartosc).hostname; } catch { return null; }
  }
  return null;
}

export default async (req) => {
  if (req.method !== 'POST') return new Response('Metoda niedozwolona', { status: 405, headers: { Allow: 'POST' } });

  const host = hostPochodzenia(req);
  if (!host || !DOZWOLONE_HOSTY.some((re) => re.test(host))) return new Response('Zabronione', { status: 403 });

  let dane;
  try { dane = await req.formData(); } catch { return przekieruj(req, '/zapis/blad/'); }

  // Pułapka na boty: ukryte pole, które człowiek zostawia puste. Botowi pokazujemy „sukces”, żeby nie próbował dalej.
  if ((dane.get('bot-field') ?? '').toString().trim() !== '') return przekieruj(req, '/zapis/sprawdz-skrzynke/');

  const email = (dane.get('email') ?? '').toString().trim().toLowerCase();
  const zgoda = dane.get('zgoda');
  if (!zgoda || email.length > 254 || !EMAIL.test(email)) return przekieruj(req, '/zapis/blad/');

  const klucz = process.env.BREVO_API_KEY;
  const szablon = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  const idListy = Number(process.env[LISTA.idEnv]);
  if (!klucz || !Number.isInteger(szablon) || szablon <= 0 || !Number.isInteger(idListy) || idListy <= 0) {
    console.error('Zapis: brak konfiguracji Brevo (klucz, szablon lub numer listy)');
    return przekieruj(req, '/zapis/blad/');
  }

  let odpowiedz;
  try {
    odpowiedz = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: { 'api-key': klucz, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ email, includeListIds: [idListy], templateId: szablon, redirectionUrl: LISTA.po }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (blad) {
    console.error('Zapis: błąd połączenia z Brevo:', blad?.name ?? 'nieznany');
    return przekieruj(req, '/zapis/blad/');
  }

  if (odpowiedz.ok) {
    console.info('Zapis: Brevo przyjęło zapis, status', odpowiedz.status);
    return przekieruj(req, '/zapis/sprawdz-skrzynke/');
  }

  // Adres, który już jest w Brevo, traktujemy jak sukces: nie ujawniamy, kto jest zapisany.
  // Wzorzec celowo wąski: „template does not exist” itp. to błąd konfiguracji, a nie powtórny zapis.
  const tresc = await odpowiedz.text().catch(() => '');
  if (odpowiedz.status === 400 && /already|duplicate/i.test(tresc)) {
    console.info('Zapis: adres już jest w Brevo (brak nowego maila z potwierdzeniem), status', odpowiedz.status);
    return przekieruj(req, '/zapis/sprawdz-skrzynke/');
  }

  console.error('Zapis: Brevo odpowiedziało błędem', odpowiedz.status, tresc.slice(0, 200).replace(email, '[adres]'));
  return przekieruj(req, '/zapis/blad/');
};
