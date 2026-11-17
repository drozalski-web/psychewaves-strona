// Katalog odzieży i toreb Psyche Waves (wzory z mockupów, jeszcze bez cen i bez sprzedaży).
// Obrazki: public/sklep/<plik>.webp (wycięte z PDF „mockupy odzież i torby”).
export type Typ = 'koszulka' | 'bluza' | 'torba';
export type Obraz = { etykieta: string; src: string };
export type WzorSklepu = {
  id: string;
  nazwa: string;      // hasło na wzorze
  typ: Typ;
  linia: string;
  kolory: string[];
  placebo?: boolean;  // na wzorze jest Placebo
  nowosc?: boolean;
  limit?: boolean;    // edycja limitowana
  opis: string;
  obrazy: Obraz[];    // pierwsza pozycja = widok główny; kolejne to kolory lub tył
};

export const typy: Record<Typ, string> = { koszulka: 'Koszulki', bluza: 'Bluzy', torba: 'Torby' };

export const linie = [
  'Placebo',
  'Rzeczy, których nie mówimy',
  'Z pazurem',
  'ADHD i wsparcie',
  'Pride',
  'Święta',
  'Na co dzień',
  'Misja',
] as const;

const img = (etykieta: string, plik: string): Obraz => ({ etykieta, src: `/sklep/${plik}.webp` });

export const wzory: WzorSklepu[] = [
  // Koszulki
  { id: 'skad-to-wiemy', nazwa: 'Skąd to wiemy?', typ: 'koszulka', linia: 'Placebo', kolory: ['Granatowa'], placebo: true, nowosc: true,
    opis: 'Placebo w fartuchu z przodu, a z tyłu trzy linie: Wiemy. Badania sugerują. Hipoteza.', obrazy: [img('Przód', 'skad-przod'), img('Tył', 'skad-tyl')] },
  { id: 'horoskopy', nazwa: 'Nie wierzę w horoskopy. Wierzę w metaanalizy.', typ: 'koszulka', linia: 'Z pazurem', kolory: ['Granatowa', 'Jasna'], placebo: true,
    opis: 'Placebo z uniesioną brwią pod hasłem dla każdego, kto woli dowody od gwiazd.', obrazy: [img('Granatowa', 'horoskopy-granatowa'), img('Jasna', 'horoskopy-jasna'), img('Tył', 'horoskopy-granatowa-tyl')] },
  { id: 'moja-terapia', nazwa: 'Moja terapia wie o tobie wszystko.', typ: 'koszulka', linia: 'Z pazurem', kolory: ['Biała'],
    opis: 'Żart dla ludzi, którzy chodzą na terapię i lubią o tym mówić.', obrazy: [img('Biała', 'moja-terapia-biala')] },
  { id: 'w-myslach', nazwa: 'Nie, nie czytam w myślach. Ale widzę, co robisz.', typ: 'koszulka', linia: 'Z pazurem', kolory: ['Biała'],
    opis: 'Dla psychologów i psycholożek oraz ich znajomych.', obrazy: [img('Biała', 'w-myslach-biala')] },
  { id: 'garsc', nazwa: 'Weź się w garść. Jestem obok.', typ: 'koszulka', linia: 'Rzeczy, których nie mówimy', kolory: ['Biała'],
    opis: 'Przekreślone zdanie, które ranią, i odpowiedź, która pomaga.', obrazy: [img('Biała', 'garsc-biala')] },
  { id: 'mozg-to-organ', nazwa: 'To tylko w twojej głowie? Tak. Mózg to organ.', typ: 'koszulka', linia: 'Rzeczy, których nie mówimy', kolory: ['Granatowa'],
    opis: 'Przekreślone zdanie i odpowiedź z Psyche Waves.', obrazy: [img('Granatowa', 'mozg-granatowa')] },
  { id: 'sie-liczy', nazwa: 'Inni mają gorzej? Twoje też się liczy.', typ: 'koszulka', linia: 'Rzeczy, których nie mówimy', kolory: ['Jasna'],
    opis: 'Przekreślone zdanie i odpowiedź dla tych, którzy porównują swój ból.', obrazy: [img('Jasna', 'sie-liczy-jasna')] },
  { id: 'to-nie-lenistwo', nazwa: 'To nie lenistwo. To funkcje wykonawcze.', typ: 'koszulka', linia: 'ADHD i wsparcie', kolory: ['Biała'],
    opis: 'Krótko o tym, czego nie widać z zewnątrz.', obrazy: [img('Biała', 'adhd-biala')] },
  { id: 'wartosc', nazwa: 'Czasem nie mam siły. Zawsze mam wartość.', typ: 'koszulka', linia: 'ADHD i wsparcie', kolory: ['Granatowa'],
    opis: 'Dla gorszych dni, kiedy produktywność nie jest miarą człowieka.', obrazy: [img('Granatowa', 'wartosc-granatowa')] },
  { id: 'produktywny', nazwa: 'Nie zawsze muszę być produktywny(a).', typ: 'koszulka', linia: 'ADHD i wsparcie', kolory: ['Biała'],
    opis: 'Dwie wersje tekstu (męska i żeńska), wybierane przy zamówieniu.', obrazy: [img('Biała', 'produktywny-biala')] },
  { id: 'fun', nazwa: 'Fun. Not „fun”.', typ: 'koszulka', linia: 'Pride', kolory: ['Granatowa'],
    opis: 'Pride bez wstydu i bez moralizowania, z napisem w stylu bio.', obrazy: [img('Granatowa', 'fun-granatowa')] },
  { id: 'therapy', nazwa: 'Therapy · Right Now', typ: 'koszulka', linia: 'Pride', kolory: ['Biała'],
    opis: 'Status „Right Now”, który mówi, że dbanie o siebie to dobry plan na dziś.', obrazy: [img('Biała', 'therapy-biala')] },
  { id: 'looking-for', nazwa: 'Looking for: bezpieczny styl przywiązania', typ: 'koszulka', linia: 'Pride', kolory: ['Jasna'],
    opis: 'Dla szukających bezpiecznego przywiązania.', obrazy: [img('Jasna', 'looking-for-jasna')] },
  { id: 'no-shame', nazwa: 'No shame. No stigma.', typ: 'koszulka', linia: 'Pride', kolory: ['Biała'],
    opis: 'Bez wstydu, bez stygmatyzacji.', obrazy: [img('Biała', 'no-shame-biala')] },
  { id: '200m', nazwa: '200 m away. Emotionally unavailable.', typ: 'koszulka', linia: 'Pride', kolory: ['Granatowa'],
    opis: 'Autoironiczny żart o dystansie, w stylu opisu profilu.', obrazy: [img('Granatowa', '200m-granatowa')] },
  { id: 'chemia', nazwa: 'Chemia? Tylko między nami.', typ: 'koszulka', linia: 'Pride', kolory: ['Biała'],
    opis: 'Gra słów o chemii między ludźmi.', obrazy: [img('Biała', 'chemia-biala')] },
  { id: 'nie-diagnozuje', nazwa: 'Przy wigilijnym stole nie diagnozuję. Nawet cioci.', typ: 'koszulka', linia: 'Święta', kolory: ['Jasna'], placebo: true,
    opis: 'Dla psychologów przy świątecznym stole. Placebo i choinka z fali.', obrazy: [img('Jasna', 'nie-diagnozuje-jasna')] },
  { id: 'cicha-noc', nazwa: 'Cicha noc. Dosłownie, proszę.', typ: 'koszulka', linia: 'Święta', kolory: ['Granatowa'], placebo: true,
    opis: 'Dla osób neuroatypowych, które lubią ciszę. Placebo z ciepłym uśmiechem.', obrazy: [img('Granatowa', 'cicha-noc-granatowa')] },
  { id: 'zdrowie-nie-trend', nazwa: 'Zdrowie psychiczne to nie trend.', typ: 'koszulka', linia: 'Misja', kolory: ['Biała'],
    opis: 'Prosta koszulka z napisem na przodzie. Szczegóły dotyczące tyłu podam po ustaleniach z partnerem.', obrazy: [img('Przód', 'zdrowie-przod')] },
  { id: 'przepracowane', nazwa: 'Przepracowane.', typ: 'koszulka', linia: 'Na co dzień', kolory: ['Biała', 'Granatowa'],
    opis: 'Jedno słowo i fala EEG, która kończy się kroplą.', obrazy: [img('Biała', 'przepracowane-biala'), img('Granatowa', 'przepracowane-granatowa')] },
  // Bluzy
  { id: 'po-sesji', nazwa: 'Po sesji.', typ: 'bluza', linia: 'Na co dzień', kolory: ['Granatowa'],
    opis: 'Haftowany napis i znak na piersi, a z tyłu fala „przed sesją i po sesji”.', obrazy: [img('Przód', 'po-sesji-przod'), img('Tył', 'po-sesji-tyl')] },
  { id: 'bateria', nazwa: 'Bateria społeczna. Placebo wygląda zza kieszeni.', typ: 'bluza', linia: 'Placebo', kolory: ['Granatowa'], placebo: true,
    opis: 'Z tyłu na kapturze bateria na 3%, a „Kaptur w górze = ładuję się”.', obrazy: [img('Przód', 'bateria-przod'), img('Tył', 'bateria-tyl')] },
  { id: 'fale', nazwa: 'Fale. Myślę, więc mam fale.', typ: 'bluza', linia: 'Placebo', kolory: ['Granatowa'], placebo: true, limit: true,
    opis: 'Edycja limitowana. Na kapturze mapa 19 elektrod EEG, a pod napisem Placebo od tyłu.', obrazy: [img('Przód', 'fale-przod'), img('Tył', 'fale-tyl')] },
  { id: '47-kart', nazwa: '47 otwartych kart. Także w głowie.', typ: 'bluza', linia: 'ADHD i wsparcie', kolory: ['Granatowa'],
    opis: 'Karty przeglądarki na przodzie, a z tyłu „Instrukcja obsługi: mózg z ADHD”.', obrazy: [img('Przód', '47-kart-przod'), img('Tył', '47-kart-tyl')] },
  { id: 'jak-mnie-wspierac', nazwa: 'Jak mnie wspierać', typ: 'bluza', linia: 'ADHD i wsparcie', kolory: ['Jasna'],
    opis: 'Na plecach trzy zasady: pytaj, bądź, ciszy.', obrazy: [img('Przód', 'wspierac-przod'), img('Tył', 'wspierac-tyl')] },
  { id: '12-potraw', nazwa: '12 potraw. 0 przeczytanych rozdziałów.', typ: 'bluza', linia: 'Święta', kolory: ['Granatowa'], placebo: true,
    opis: 'Choinka z fali i Placebo z uniesioną brwią wyglądające zza kieszeni.', obrazy: [img('Granatowa', '12-potraw')] },
  { id: 'w-swieta-sobie', nazwa: 'Cały rok pomagam innym. W święta pomagam sobie.', typ: 'bluza', linia: 'Święta', kolory: ['Jasna'], placebo: true,
    opis: 'Placebo z ciepłym uśmiechem wygląda zza kieszeni.', obrazy: [img('Jasna', 'w-swieta-sobie')] },
  // Torby
  { id: 'bagaz', nazwa: 'Bagaż emocjonalny. Wersja podręczna.', typ: 'torba', linia: 'Na co dzień', kolory: ['Naturalna'],
    opis: 'Bawełniana torba z długimi uchami i kieszenią w środku.', obrazy: [img('Naturalna', 'bagaz')] },
  { id: 'zawartosc', nazwa: 'Zawartość: mechanizmy obronne, 3 długopisy…', typ: 'torba', linia: 'Placebo', kolory: ['Granatowa'], placebo: true,
    opis: 'Lista rzeczy, które mieszczą się w tej torbie, z Placebo w rogu.', obrazy: [img('Granatowa', 'zawartosc')] },
  { id: 'nie-wszystko', nazwa: 'Nie wszystko trzeba nieść samemu.', typ: 'torba', linia: 'Placebo', kolory: ['Jasna'], placebo: true,
    opis: 'Torba z hasłem o niesieniu razem, z Placebo stojącym w rogu.', obrazy: [img('Jasna', 'nie-wszystko')] },
];

export const wyrozniane = ['skad-to-wiemy', 'bateria', 'horoskopy', 'nie-wszystko'].map((id) => wzory.find((w) => w.id === id)!);
