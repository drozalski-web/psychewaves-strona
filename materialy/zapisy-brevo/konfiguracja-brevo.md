# Newsletter na psychewaves.pl: konfiguracja Brevo krok po kroku

Strona ma gotowy formularz i funkcję, która dodaje adresy do Brevo z potwierdzeniem mailowym. Formularze są **ukryte**, dopóki nie wykonasz poniższych kroków i nie włączysz `PUBLIC_ZAPISY_AKTYWNE`. Dotyczy tylko psychewaves.pl. Sklep, stopsprawdzam.pl i mini-kurs w tym nie uczestniczą. Nazwy przycisków w Brevo bywają zmieniane, więc jeśli któryś ekran wygląda inaczej, wyślij zrzut ekranu.

## Jak to działa

1. Odwiedzający wpisuje adres i zaznacza zgodę (formularz na stronie głównej i w Publikacjach).
2. Funkcja `/api/zapis` wysyła adres do Brevo. Brevo wysyła wiadomość z linkiem potwierdzającym.
3. Po kliknięciu linku adres trafia na listę „Newsletter Psyche Waves”, a odwiedzający widzi stronę „Zapis potwierdzony”.
4. Gdy pojawia się nowa publikacja, wysyłasz kampanię z Brevo do całej listy (ręcznie, rzadko).

Klucz dostępu do Brevo trzyma tylko Netlify. Wklejasz go sam. Claude nie dotyka kluczy ani haseł.

## Stan na 23.11.2026

- Konto Brevo założone (plan darmowy), domena **psychewaves.pl uwierzytelniona** (kod Brevo, DKIM 1 i 2, DMARC), nadawca **Psyche Waves &lt;kontakt@psychewaves.pl&gt;** zweryfikowany.
- Lista **„Newsletter Psyche Waves”: ID 3**.
- Do zrobienia: szablon potwierdzenia (krok 4), klucz API i zmienne w Netlify (krok 6), test i włączenie (krok 7).

## Krok 1: konto Brevo

1. Załóż konto na https://www.brevo.com (plan darmowy). Wpisz dane nadawcy: Brevo wstawia adres organizacji do stopki każdej wiadomości, więc użyj adresu, który możesz upublicznić (np. wirtualne biuro albo adres firmy), a nie domowego.
2. Plan darmowy wysyła do 300 maili dziennie i dodaje logo Brevo w stopce wiadomości.
3. Pozycji „Last detected location” (Settings → Contacts) nie włączaj: zapisuje lokalizację odbiorców, a polityka prywatności obiecuje brak śledzenia.

## Krok 2: domena nadawcy

Maile wychodzą z adresu **kontakt@psychewaves.pl** pod nazwą „Psyche Waves”. Dzięki temu nie trzeba zakładać nowej skrzynki. Adresu z Gmaila (dodanego przez Brevo automatycznie) nie używaj jako nadawcy.

1. W Brevo: **Senders, domains & dedicated IPs** → **Domains** → **Add a domain** → `psychewaves.pl`. Poddomenę dla linków (branded subdomain) pomiń.
2. Brevo pokaże rekordy DNS: „Brevo code” (TXT) i klucz DKIM (dwa rekordy CNAME). Wybierz ręczne dodanie. **Nie podawaj Brevo hasła do OVH.**
3. W OVH (Strefa DNS domeny psychewaves.pl → **Dodaj rekord**) dodaj je dokładnie tak, jak pokazuje Brevo (nazwy i wartości kopiuj w całości). Rekord TXT ma pustą subdomenę (albo `@`), a CNAME-y mają nazwy `brevo1._domainkey` i `brevo2._domainkey`.
4. **DMARC:** Brevo wymaga w rekordzie DMARC adresu raportów. **Zmień istniejący** rekord `_dmarc` (nie dodawaj drugiego) na `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com`. Raporty trafiają do Brevo, nie do Twojej skrzynki.
5. W Brevo kliknij **Verify records**, potem **Authenticate domain**. DNS może się odświeżać od kilku minut do godziny.
6. **Senders** → **Add a sender**: nazwa „Psyche Waves”, adres kontakt@psychewaves.pl. Brevo wyśle kod na ten adres.

## Krok 3: lista

W **CRM** → **Contacts** → **Lists** utwórz listę „Newsletter Psyche Waves” i zapisz jej numer (ID). U nas: **3**.

## Krok 4: szablon wiadomości z linkiem potwierdzającym

W Brevo: **Marketing** → **Templates** → **Create a template** → **Email template**. Instrukcja Brevo: [Create a custom double opt-in (DOI) email template](https://help.brevo.com/hc/en-us/articles/360019540880). Zapisz numer (ID) szablonu po zapisaniu (status **Active**).

- **Nazwa szablonu** (tylko dla Ciebie): Potwierdzenie zapisu na newsletter
- **Sender name:** `Psyche Waves`
- **Sender email:** `kontakt@psychewaves.pl`
- **Temat:** `Placebo prosi o potwierdzenie`
- **Podgląd (Preview text):** `„Skąd to wiemy?” Najpierw sprawdźmy, czy ten adres jest Twój.`

**Treść** (część nad stopką):

```text
Cześć,

cieszę się, że mogę powitać Cię w przestrzeni Psyche Waves.

Placebo, mój szczur w czapce EEG, zadaje przy każdej tezie jedno pytanie: „Skąd to wiemy?” Zadaje je też teraz: skąd wiemy, że ten adres należy do Ciebie? Potwierdź go jednym kliknięciem:

[Potwierdzam zapis]

Co potem? Gdy pojawi się nowa publikacja, dostaniesz o niej wiadomość: z krótkim opisem, pełną listą źródeł i poziomem pewności przy każdej tezie, żeby od razu było widać, na ile można w coś wierzyć. Rzadko, bez spamu, bez reklam.
```

- „[Potwierdzam zapis]” to **przycisk lub link** z adresem dokładnie: `{{ params.DOIurl }}` (specjalny znacznik Brevo, zamieniany na indywidualny link potwierdzający). Bez przycisku i tego adresu szablon nie zadziała. Jeśli edytor dopisuje `https://` przed znacznikiem, użyj przycisku **{ }** (wstaw zmienną).
- **Stopka:** zamiast własnego podpisu wklej plik [`stopka-newslettera.html`](stopka-newslettera.html) w bloku **Custom HTML** (albo w edytorze HTML szablonu). To zatwierdzony podpis marki (Pozdrawiam, Daniel Różalski, Psyche Waves, strona i Instagram, bez numeru telefonu) plus zastrzeżenie edukacyjne, linijka pomocowa i informacja o administratorze adresu. Logo ładuje się z `https://psychewaves.pl/mail/logo-stopka.png`, więc wkleić można dopiero po wdrożeniu tego pliku na stronę.
- Brevo może samo dopisać pod stopką adres organizacji. Sprawdź to w podglądzie.
- Wiadomość z potwierdzeniem nie ma linku do wypisania (odbiorca nie jest jeszcze na liście). Linki do wypisania dodaje Brevo automatycznie w kampaniach.

## Krok 5: ustawienia wysyłki

1. **Śledzenie otwarć i kliknięć wyłącz**, jeśli Brevo na to pozwala w ustawieniach wiadomości lub konta. Polityka prywatności obiecuje, że newsletter tego nie robi. Jeśli na planie darmowym nie da się tego wyłączyć, napisz, a poprawię zdanie w polityce.
2. Każda kampania musi mieć w stopce link do wypisania (Brevo dodaje go automatycznie) i zastrzeżenie „Treści edukacyjne; nie zastępują konsultacji ze specjalistą.” Możesz użyć tej samej stopki z kroku 4.

## Krok 6: klucz API w Netlify

1. W Brevo: **SMTP & API** → **API keys** → **Generate a new API key** (nazwa np. „Strona”). Klucz pokazuje się tylko raz, skopiuj go.
2. W Netlify wejdź w projekt **adorable-haupia-18a01f** (to jest psychewaves.pl): **Project configuration** → **Environment variables** → **Add a variable**:

| Zmienna | Wartość |
|---|---|
| `BREVO_API_KEY` | klucz z Brevo (zaznacz jako sekretny) |
| `BREVO_DOI_TEMPLATE_ID` | numer szablonu z kroku 4 |
| `BREVO_LISTA_NEWSLETTER` | `3` (numer listy z kroku 3) |

Do projektu `stopsprawdzam` nic nie dodajesz.

## Krok 7: test i włączenie

1. Najpierw sprawdź na podglądzie: dodaj `PUBLIC_ZAPISY_AKTYWNE=true` w Netlify tylko dla kontekstu **Deploy Previews**. Otwórz podgląd dowolnego PR-a, zapisz własny adres i przejdź całą drogę: wiadomość z linkiem, kliknięcie, strona „Zapis potwierdzony”.
2. Gdy działa, dodaj `PUBLIC_ZAPISY_AKTYWNE=true` dla produkcji i uruchom nowe wdrożenie. Napisz do Claude, a pomoże.

## Zabezpieczenia i ograniczenia

- Funkcja przyjmuje zapisy tylko z psychewaves.pl (i podglądów jego projektu), ma ukryte pole pułapkę na boty i nie ujawnia, kto już jest zapisany.
- Nie ma limitu zapisów z jednego adresu IP. Ktoś mógłby wpisywać cudze adresy, ale dostaną one tylko jedną wiadomość z prośbą o potwierdzenie i na tym koniec. Jeśli to się zacznie nadużywać, dodamy CAPTCHA.
- Dotychczasowe formularze „Powiadom mnie” (sklep, Placebo Junior) nadal zbierają adresy w Netlify i niczego nie wysyłają. Nie importujemy ich do Brevo bez nowej zgody, bo ludzie zgodzili się na inne wiadomości.
- Mini-kurs #stopsprawdzam jest wstrzymany. Jeśli wróci, dojdzie druga lista, formularz na stopsprawdzam.pl i automatyzacja z siedmioma mailami.
