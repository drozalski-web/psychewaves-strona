# Newsletter na psychewaves.pl: konfiguracja Brevo krok po kroku

Strona ma gotowy formularz i funkcję, która dodaje adresy do Brevo z potwierdzeniem mailowym. Formularze są **ukryte**, dopóki nie wykonasz poniższych kroków i nie włączysz `PUBLIC_ZAPISY_AKTYWNE`. Dotyczy tylko psychewaves.pl. Sklep, stopsprawdzam.pl i mini-kurs w tym nie uczestniczą. Nazwy przycisków w Brevo bywają zmieniane, więc jeśli któryś ekran wygląda inaczej, wyślij zrzut ekranu.

## Jak to działa

1. Odwiedzający wpisuje adres i zaznacza zgodę (formularz na stronie głównej i w Publikacjach).
2. Funkcja `/api/zapis` wysyła adres do Brevo. Brevo wysyła wiadomość z linkiem potwierdzającym.
3. Po kliknięciu linku adres trafia na listę „Newsletter Psyche Waves”, a odwiedzający widzi stronę „Zapis potwierdzony”.
4. Gdy pojawia się nowa publikacja, wysyłasz kampanię z Brevo do całej listy (ręcznie, rzadko).

Klucz dostępu do Brevo trzyma tylko Netlify. Wklejasz go sam. Claude nie dotyka kluczy ani haseł.

## Krok 1: konto Brevo

1. Załóż konto na https://www.brevo.com (plan darmowy). Wpisz prawdziwe dane nadawcy: Brevo wymaga ich do stopki każdej wiadomości.
2. Zanotuj, że darmowy plan wysyła do 300 maili dziennie i dodaje logo Brevo w stopce wiadomości.

## Krok 2: domena nadawcy

Maile będą wychodzić z adresu **kontakt@psychewaves.pl** pod nazwą „Psyche Waves”. Dzięki temu nie trzeba zakładać nowej skrzynki.

1. W Brevo: **Senders, domains & dedicated IPs** → **Domains** → **Add a domain** → `psychewaves.pl`.
2. Brevo pokaże rekordy DNS: „Brevo code” (TXT) i klucz DKIM (dwa rekordy CNAME albo jeden TXT). Wybierz ręczne dodanie. **Nie podawaj Brevo hasła do OVH.**
3. W OVH (Strefa DNS domeny psychewaves.pl → **Dodaj rekord**) dodaj je dokładnie tak, jak pokazuje Brevo (nazwy i wartości kopiuj w całości). Nazwę główną domeny wpisujesz jako `@`.
4. **DMARC:** psychewaves.pl ma już rekord `_dmarc` (`v=DMARC1; p=none;`). Jeśli Brevo proponuje jego zastąpienie, nie zastępuj, tylko zostaw obecny.
5. W Brevo kliknij **Verify**. DNS może się odświeżać od kilku minut do godziny.
6. **Senders** → **Add a sender**: nazwa „Psyche Waves”, adres kontakt@psychewaves.pl. Brevo wyśle kod na ten adres (sprawdź w Outlooku).

## Krok 3: lista

W **Contacts** → **Lists** utwórz listę „Newsletter Psyche Waves” i zapisz jej numer (ID).

## Krok 4: szablon wiadomości z linkiem potwierdzającym

Brevo wymaga szablonu typu „double opt-in”. Instrukcja Brevo: [Create a custom double opt-in (DOI) email template](https://help.brevo.com/hc/en-us/articles/360019540880). Szablon musi zawierać link potwierdzający (zmienna `{{ params.DOIurl }}`). Zapisz numer (ID) szablonu.

Propozycja treści:

> **Temat:** Potwierdź zapis na newsletter
>
> Cześć,
>
> ten adres został wpisany w formularzu zapisu na newsletter Psyche Waves na stronie psychewaves.pl. Żeby zapis był ważny, kliknij link:
>
> [Potwierdzam zapis]({{ params.DOIurl }})
>
> Jeśli ten adres wpisał ktoś inny, zignoruj tę wiadomość. Bez kliknięcia nie dostaniesz żadnych kolejnych maili.
>
> Daniel
>
> Treści edukacyjne; nie zastępują konsultacji ze specjalistą. Administrator adresu: Daniel Różalski, kontakt@psychewaves.pl.

## Krok 5: ustawienia wysyłki

1. **Śledzenie otwarć i kliknięć wyłącz**, jeśli Brevo na to pozwala w ustawieniach wiadomości lub konta. Polityka prywatności obiecuje, że newsletter tego nie robi. Jeśli na planie darmowym nie da się tego wyłączyć, napisz, a poprawię zdanie w polityce.
2. Każda kampania musi mieć w stopce link do wypisania (Brevo dodaje go automatycznie) i zastrzeżenie „Treści edukacyjne; nie zastępują konsultacji ze specjalistą.”

## Krok 6: klucz API w Netlify

1. W Brevo: **SMTP & API** → **API keys** → **Generate a new API key** (nazwa np. „Strona”). Klucz pokazuje się tylko raz, skopiuj go.
2. W Netlify wejdź w projekt **adorable-haupia-18a01f** (to jest psychewaves.pl): **Project configuration** → **Environment variables** → **Add a variable**:

| Zmienna | Wartość |
|---|---|
| `BREVO_API_KEY` | klucz z Brevo (zaznacz jako sekretny) |
| `BREVO_DOI_TEMPLATE_ID` | numer szablonu z kroku 4 |
| `BREVO_LISTA_NEWSLETTER` | numer listy z kroku 3 |

Do projektu `stopsprawdzam` nic nie dodajesz.

## Krok 7: test i włączenie

1. Najpierw sprawdź na podglądzie: dodaj `PUBLIC_ZAPISY_AKTYWNE=true` w Netlify tylko dla kontekstu **Deploy Previews**. Otwórz podgląd dowolnego PR-a, zapisz własny adres i przejdź całą drogę: wiadomość z linkiem, kliknięcie, strona „Zapis potwierdzony”.
2. Gdy działa, dodaj `PUBLIC_ZAPISY_AKTYWNE=true` dla produkcji i uruchom nowe wdrożenie. Napisz do Claude, a pomoże.

## Zabezpieczenia i ograniczenia

- Funkcja przyjmuje zapisy tylko z psychewaves.pl (i podglądów jego projektu), ma ukryte pole pułapkę na boty i nie ujawnia, kto już jest zapisany.
- Nie ma limitu zapisów z jednego adresu IP. Ktoś mógłby wpisywać cudze adresy, ale dostaną one tylko jedną wiadomość z prośbą o potwierdzenie i na tym koniec. Jeśli to się zacznie nadużywać, dodamy CAPTCHA.
- Dotychczasowe formularze „Powiadom mnie” (sklep, Placebo Junior) nadal zbierają adresy w Netlify i niczego nie wysyłają. Nie importujemy ich do Brevo bez nowej zgody, bo ludzie zgodzili się na inne wiadomości.
- Mini-kurs #stopsprawdzam jest wstrzymany. Jeśli wróci, dojdzie druga lista, formularz na stopsprawdzam.pl i automatyzacja z siedmioma mailami.
