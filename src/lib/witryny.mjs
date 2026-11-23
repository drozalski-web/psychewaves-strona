// Jeden kod, dwie strony:
//   psychewaves.pl    – edukacja dla dorosłych oraz wyspa Placebo Junior (/placebo-junior/*, z własnym sklepem i podziękowaniem),
//   stopsprawdzam.pl  – akcja #stopsprawdzam i sklep dla dorosłych: odzież i materiały (budowa z PUBLIC_WITRYNA=stopsprawdzam).
// Dopóki sklep nie jest przeniesiony, psychewaves.pl buduje się z całym sklepem pod /sklep/.
// Plik w czystym JS, bo korzystają z niego i komponenty, i astro.config.mjs.

export const ADRES_PW = 'https://psychewaves.pl';
export const ADRES_SS = 'https://stopsprawdzam.pl';

/** Ustawienia budowy na podstawie zmiennych środowiskowych (process.env albo import.meta.env). */
export function ustawienia(env) {
  const naStopsprawdzam = env.PUBLIC_WITRYNA === 'stopsprawdzam';
  return {
    naStopsprawdzam,
    // Na psychewaves.pl ustaw PUBLIC_SKLEP_NA_STOPSPRAWDZAM=true dopiero wtedy, gdy stopsprawdzam.pl działa.
    sklepPrzeniesiony: naStopsprawdzam || env.PUBLIC_SKLEP_NA_STOPSPRAWDZAM === 'true',
  };
}

/** Strony, które po przeniesieniu mieszkają na stopsprawdzam.pl (ścieżki tak, jak buduje je Astro). */
export const czescStopsprawdzam = (p) => p === '/stopsprawdzam/' || p.startsWith('/sklep/');

/** Strony obecne na obu domenach. Placebo Junior ma własne podziękowanie (/placebo-junior/dziekuje/), więc /sklep/dziekuje/ jest tylko na stopsprawdzam.pl.
 *  Strony /zapis/* (potwierdzenia zapisu na newsletter) są tylko na psychewaves.pl: na stopsprawdzam.pl nie ma zapisów. */
export const wspolne = (p) => p === '/polityka-prywatnosci/' || p === '/404';

/** Zamienia odnośnik wewnętrzny na właściwy dla budowanej strony (ścieżkę albo pełny adres drugiej domeny). */
export function przepiszAdres(href, { naStopsprawdzam, sklepPrzeniesiony }) {
  if (!sklepPrzeniesiony || !href.startsWith('/') || href.startsWith('//')) return href;
  const [, sciezka, reszta] = href.match(/^([^?#]*)(.*)$/);
  if (sciezka.startsWith('/_astro/') || /\.[a-z0-9]+$/i.test(sciezka)) return href; // pliki, nie strony
  const p = sciezka.endsWith('/') ? sciezka : `${sciezka}/`;
  if (naStopsprawdzam) {
    if (p === '/stopsprawdzam/') return `/${reszta}`;
    if (p === '/' || czescStopsprawdzam(p) || wspolne(p)) return href;
    return ADRES_PW + sciezka + reszta;
  }
  if (p === '/stopsprawdzam/') return `${ADRES_SS}/${reszta}`;
  if (czescStopsprawdzam(p)) return ADRES_SS + sciezka + reszta;
  return href;
}
