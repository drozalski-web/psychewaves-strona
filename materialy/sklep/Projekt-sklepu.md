# Projekt sklepu Psyche Waves

Wersja 1.0 · 17.11.2026 · do akceptacji Daniela. Stan wyjściowy: mamy specyfikację odzieży i toreb oraz mockupy 30 wzorów (koszulki, bluzy, torby), ale żadnego gotowego produktu, cen ani drukarni. Projekt opisuje, jak sklep ma wyglądać i jak go uruchamiać etapami, żeby nic nie zmyślać i nie kupować nakładów, na które nikt nie czeka.

## 1. Założenie: najpierw showroom, potem sprzedaż

Sklep ruszy w czterech etapach. Dziś jesteśmy w etapie 0.

| Etap | Co działa | Warunek przejścia dalej |
|---|---|---|
| 0 · Showroom (teraz) | Wzory z mockupów, filtry, przycisk „Chcę to”, zapis na listę. Brak cen i koszyka. | Wycena od drukarni i próbki wybranych wzorów |
| 1 · Przedsprzedaż | Ten sam katalog z cenami i terminem. Płatność z góry za zamówienie na wzory z największą liczbą zapisów. | Dopięte formalności sprzedaży i regulamin |
| 2 · Sprzedaż na zamówienie | Pełny koszyk, rozmiary, wysyłka bezpośrednio z drukarni z kartką Psyche Waves w paczce. | Stabilny czas realizacji i zwroty |
| 3 · Rozbudowa | Nowe linie (np. świąteczna), edycje limitowane, produkty fizyczne Placebo Junior (maskotka, naklejki). | Wyniki sprzedaży |

Próg zapisów potrzebny do przejścia z etapu 0 do 1 ustalimy po wycenie, bo zależy od kosztów próbek. Nie podaję liczby z góry.

## 2. Struktura strony

- `/sklep/`: strona główna sklepu: hasło, trzy kafelki działów, wyróżnione wzory, „Jak to będzie działać”, lista oczekujących.
- `/sklep/odziez/`: katalog 30 wzorów z filtrami (rodzaj, linia, „Z Placebo”), przyciskiem „Chcę to” i formularzem zapisu na dole.
- `/sklep/materialy/`: materiały cyfrowe do wydruku dla dorosłych.
- `/sklep/placebo-junior/`: karty pracy dla dzieci i gadżety, w tym maskotka Placebo.
- Pasek zakładek w sklepie (Sklep · Odzież i torby · Materiały · Placebo Junior) i znacznik „Sklep w przygotowaniu” na każdej stronie sklepu.

Zasada: sklep dla dorosłych (odzież, materiały) jest oddzielony od Placebo Junior. Strona Placebo Junior prowadzi tylko do swojej sekcji w sklepie.

## 3. Jak działa etap 0

1. Odwiedzający przegląda wzory (przód i tył lub kolory, jeśli są), filtruje je i zaznacza „Chcę to”.
2. Na dole zostawia e-mail i zgodę. Zapis trafia do Netlify Forms (formularz „wybor-wzorow”, z listą wybranych wzorów).
3. Po stronie Daniela: panel Netlify pokazuje, które wzory wybrano najczęściej. To podstawa decyzji o pierwszej produkcji.
4. Osobne zapisy mają: lista sklepu (landing), materiały i Placebo Junior (z polem „Chcę maskotkę”).

## 4. Docelowa karta produktu (etap 1 i 2)

- Galeria: przód, tył, kolory. Zdjęcia z próbek, nie tylko mockupy.
- Nazwa hasła, linia, krótki opis, informacje o materiale (według specyfikacji: bawełna organiczna GOTS, koszulka 180–220 g/m², bluza 300–350 g/m², torba 280–340 g/m²; po potwierdzeniu przez drukarnię).
- Wybór koloru i rozmiaru (XS–XXL), tabela rozmiarów, cena, czas realizacji.
- Informacja o technice (DTG lub DTF, haft tam, gdzie dotyczy) i o pielęgnacji (wytrzymałość nadruku podaje drukarnia).
- Przycisk „Dodaj do koszyka” i link do zasad wysyłki i zwrotów.

## 5. Koszyk i płatność: trzy opcje

| Opcja | Plusy | Minusy |
|---|---|---|
| A. Katalog na stronie + płatność przez link płatniczy lub Checkout (np. Stripe) | Najprostsze, tanie, pełna kontrola wyglądu. | Każdy wariant (rozmiar) wymaga osobnego linku lub prostego skryptu. Zamówienie trzeba przekazać drukarni. |
| B. Lekki koszyk w stronie (np. Snipcart) | Koszyk, kody, rozmiary jako warianty. | Prowizja lub abonament. Integracja z drukarnią nadal po stronie Daniela. |
| C. Integracja z drukarnią lub platformą print on demand | Zamówienia lecą do produkcji automatycznie. | Zależność od jednej drukarni, mniej kontroli nad wyglądem. |

Rekomendacja: etap 1 na opcji A (przedsprzedaż, ręczne przekazanie zamówień), etap 2 po wycenie wybrać B lub C. Dostępność metod płatności (BLIK, przelewy) i prowizje do sprawdzenia w dniu wyboru.

## 6. Dane i zarządzanie

Katalog jest w jednym pliku (`src/data/sklep.ts`): hasło, rodzaj, linia, kolory, opis, obrazy. Materiały cyfrowe i produkty Placebo Junior są w `src/data/produkty.ts`. Dodanie ceny, rozmiarów i statusu „dostępne” to zmiana danych, nie przebudowa strony.

## 7. Ryzyka i sprawy do rozstrzygnięcia

- **Wzór „Zdrowie psychiczne to nie trend”.** Na mockupie z tyłu jest zapis, że część kwoty idzie na pomoc młodym osobom w kryzysie, a kwotę i fundację ma dopisać umowa. Na stronie pokazuję tylko przód, a tył ukrywam, dopóki umowy nie ma. Deklaracji darowizny nie publikujemy bez podpisanej umowy.
- **Wzory Pride, w tym „Chemia?”.** Sklep dla dorosłych dzieli stronę z Placebo Junior. Decyzja: czy te wzory mają być widoczne bez ostrzeżenia, czy w osobnej grupie „Pride” z informacją, że to treści dla dorosłych.
- **Placebo na odzieży.** Wariant A jest domyślny, wariant B (w fartuchu, z napisem „PLACEBO” na plakietce) jest na koszulce „Skąd to wiemy?”. Pisownię plakietki trzeba sprawdzić na próbie. Przed sprzedażą: znak towarowy (nazwa „Placebo” jest powszechna) i prawa do grafik AI.
- **Maskotka (zabawka).** Przed produkcją trzeba potwierdzić od producenta zgodność z wymogami bezpieczeństwa zabawek (oznakowanie CE, badania według normy EN 71). W opisie nie ma deklaracji terapeutycznych.
- **Formalności sprzedaży.** Forma działalności i rozliczenia (w tym VAT), regulamin, polityka prywatności, zasady zwrotów. Dla odzieży z nadrukiem robionej na zamówienie prawo odstąpienia może wyglądać inaczej niż dla towaru seryjnego: do sprawdzenia z księgową lub prawnikiem.
- **Zdjęcia.** Mockupy są poglądowe (kolory HEX orientacyjne). Przed sprzedażą potrzebne zdjęcia próbek.
- **Wzór „Nie zawsze muszę być produktywny(a)”.** Dwie wersje językowe wybierane przy zamówieniu: w koszyku musi to być pole wyboru.

## 8. Pytania do Daniela

1. Czy etapy 0–3 i przejście przez przedsprzedaż Ci odpowiadają?
2. Czy wzory Pride mają być w osobnej grupie z oznaczeniem „dla dorosłych”?
3. Które 5–6 wzorów chcesz wycenić i uszyć jako pierwsze próbki (podpowiedź: wzór „Skąd to wiemy?”, „Nie wierzę w horoskopy”, „Przepracowane.”, bluza „Po sesji”, torba „Bagaż emocjonalny”)?
4. Czy mam dodać na stronie krótką sekcję „Jak powstają nasze rzeczy” (materiał, produkcja na zamówienie) po odpowiedzi drukarni?
5. Czy przedsprzedaż ma obejmować tylko osoby z listy, czy wszystkich?
