// Produkty Linii Placebo. Jedno źródło danych dla /sklep/ i /placebo-junior/.
// status: 'dostepne' (do pobrania lub kupienia) albo 'wkrotce'. Cen nie podajemy, dopóki produkt nie jest gotowy.
// dodano: data wejścia do sklepu (RRRR-MM-DD), potrzebna dla produktów dostępnych: „najnowszy” = najpóźniejsza data.
export type Produkt = {
  grupa: 'dorosli' | 'junior';
  rodzaj: 'karta' | 'gadzet' | 'materialy';
  id: string;
  nazwa: string;
  typ: string;
  opis: string;
  status: 'dostepne' | 'wkrotce';
  darmowy?: boolean;
  href?: string;
  dodano?: string;
};

export const produkty: Produkt[] = [
  { grupa: 'dorosli', rodzaj: 'materialy', id: 'checklista', nazwa: 'Skąd to wiemy? Checklista czytania badań', typ: 'Dla studentów i dorosłych · PDF', opis: 'Siedem pytań, które warto zadać każdej tezie z psychologii: kto badał, na kim, z jaką próbą, z grupą kontrolną czy bez, co z tego wynika, a co nie.', status: 'wkrotce' },
  { grupa: 'dorosli', rodzaj: 'materialy', id: 'poziomy', nazwa: 'Plansza „Poziomy pewności”', typ: 'Plakat · PDF', opis: 'Wiemy, badania sugerują, hipoteza: jak to rozróżniać i skąd Psyche Waves je bierze. Do notatek, pokoju studenta, gabinetu.', status: 'wkrotce' },
  { grupa: 'dorosli', rodzaj: 'materialy', id: 'mity-eeg', nazwa: 'Karty „Mit czy fakt: EEG”', typ: 'Zestaw kart · PDF', opis: 'Co mierzy EEG, a czego nie powie. Z krótkimi uzasadnieniami i źródłami.', status: 'wkrotce' },
  { grupa: 'junior', rodzaj: 'karta', id: 'karta-fale', nazwa: 'Fale w mojej głowie', typ: 'Karta pracy · 6–10 lat · PDF, 2 strony', opis: 'Termometr fal, mapa ciała, oddech z kroplą i spokojny krok wybrany przez dziecko. Ze wskazówkami dla dorosłego.', status: 'dostepne', darmowy: true, href: '/karty-pracy/placebo-fale-w-mojej-glowie.pdf', dodano: '2026-11-15' },
  { grupa: 'junior', rodzaj: 'karta', id: 'pakiet-kart', nazwa: 'Pakiet kart pracy z Placebo', typ: 'Zestaw 10 kart · PDF', opis: 'Emocje w ciele, oddech z kroplą, „skąd to wiem?” dla małych detektywów, plan na trudny dzień. Z krótkim przewodnikiem dla rodzica lub nauczyciela.', status: 'wkrotce' },
  { grupa: 'junior', rodzaj: 'gadzet', id: 'maskotka', nazwa: 'Maskotka Placebo', typ: 'Gadżet · pierwszy w produkcji', opis: 'Miękka maskotka Placebo w fartuchu z plakietką. Pilnuje biurka, plecaka albo łóżka i patrzy tak, jakby właśnie pytała „skąd to wiemy?”. Dla dzieci, rodziców i wszystkich, którzy lubią sceptycznego szczura.', status: 'wkrotce' },
  { grupa: 'junior', rodzaj: 'gadzet', id: 'naklejki', nazwa: 'Naklejki Placebo', typ: 'Gadżet · sklep w przygotowaniu', opis: 'Sześć min Placebo na arkuszu naklejek: od „bez wrażenia” po wielki uśmiech. Najpierw sprawdzam jakość druku i koszty wysyłki.', status: 'wkrotce' },
  { grupa: 'junior', rodzaj: 'gadzet', id: 'notes', nazwa: 'Notes „Fale się uspokajają”', typ: 'Gadżet · sklep w przygotowaniu', opis: 'Mały notes, w którym można rysować swoje fale. To narzędzie do obserwacji, nie terapia.', status: 'wkrotce' },
];

export const grupy = [
  { id: 'dorosli', nazwa: 'Dla dorosłych i studentów', opis: 'Placebo jako przewodnik po dowodach: materiały do krytycznego czytania psychologii.' },
  { id: 'junior', nazwa: 'Linia Placebo Junior', opis: 'Karty pracy i gadżety dla dzieci i dorosłych, którzy z nimi pracują. Odrębna, łagodna linia.' },
] as const;

const najnowszy = (lista: Produkt[]) => [...lista].sort((a, b) => (b.dodano ?? '').localeCompare(a.dodano ?? ''))[0];

/** Najnowsza darmowa karta pracy Placebo Junior, która weszła do sklepu. */
export const najnowszaDarmowaKarta = () => najnowszy(produkty.filter((p) => p.grupa === 'junior' && p.rodzaj === 'karta' && p.status === 'dostepne' && p.darmowy));

/** Najnowszy gadżet Placebo Junior dostępny w sklepie (null, jeśli żaden jeszcze nie wszedł). */
export const najnowszyGadzet = () => najnowszy(produkty.filter((p) => p.grupa === 'junior' && p.rodzaj === 'gadzet' && p.status === 'dostepne')) ?? null;

/** Pierwszy gadżet czekający na premierę (do komunikatu „wkrótce”). */
export const gadzetWkrotce = () => produkty.find((p) => p.grupa === 'junior' && p.rodzaj === 'gadzet' && p.status === 'wkrotce') ?? null;
