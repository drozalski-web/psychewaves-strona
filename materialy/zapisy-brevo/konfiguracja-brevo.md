# Zapisy na kurs i newsletter: konfiguracja Brevo krok po kroku

Strona ma gotowe formularze i funkcję, która dodaje adresy do Brevo z potwierdzeniem mailowym. Formularze są **ukryte**, dopóki nie wykonasz poniższych kroków i nie włączysz `PUBLIC_ZAPISY_AKTYWNE`. Nazwy przycisków w Brevo bywają zmieniane, więc jeśli któryś ekran wygląda inaczej, wyślij zrzut ekranu.

## Jak to działa

1. Odwiedzający wpisuje adres i zaznacza zgodę (formularz na stopsprawdzam.pl: kurs, na psychewaves.pl: newsletter).
2. Funkcja `/api/zapis` wysyła adres do Brevo. Brevo wysyła wiadomość z linkiem potwierdzającym.
3. Po kliknięciu linku adres trafia na właściwą listę, a odwiedzający widzi stronę „Zapis potwierdzony”.
4. Dla listy kursu automatyzacja w Brevo sama wysyła siedem maili, po jednym dziennie.

Klucz dostępu do Brevo trzyma tylko Netlify. Wklejasz go sam. Claude nie dotyka kluczy ani haseł.

## Krok 1: konto Brevo

1. Załóż konto na https://www.brevo.com (plan darmowy). Wpisz prawdziwe dane nadawcy: Brevo wymaga ich do stopki każdej wiadomości.
2. Sprawdź w planie darmowym limity automatyzacji (**Automation**): czy zmieści się przepływ z 7 mailami i przerwami między nimi. Jeśli nie, napisz.

## Krok 2: domena nadawcy

Maile będą wychodzić z adresu **kontakt@psychewaves.pl** pod nazwą „Placebo z #stopsprawdzam”. Dzięki temu nie trzeba zakładać nowej skrzynki.

1. W Brevo: **Senders, domains & dedicated IPs** → **Domains** → **Add a domain** → `psychewaves.pl`.
2. Brevo pokaże rekordy DNS: „Brevo code” (TXT) i klucz DKIM (dwa rekordy CNAME albo jeden TXT). Wybierz ręczne dodanie. **Nie podawaj Brevo hasła do OVH.**
3. W OVH (Strefa DNS domeny psychewaves.pl → **Dodaj rekord**) dodaj je dokładnie tak, jak pokazuje Brevo (nazwy i wartości kopiuj w całości). Nazwę główną domeny wpisujesz jako `@`.
4. **DMARC:** psychewaves.pl ma już rekord `_dmarc` (`v=DMARC1; p=none;`). Jeśli Brevo proponuje jego zastąpienie, nie zastępuj, tylko zostaw obecny.
5. W Brevo kliknij **Verify**. DNS może się odświeżać od kilku minut do godziny.
6. **Senders** → **Add a sender**: nazwa „Placebo z #stopsprawdzam”, adres kontakt@psychewaves.pl. Brevo wyśle kod na ten adres (sprawdź w Outlooku).

## Krok 3: dwie listy

W **Contacts** → **Lists** utwórz:

- „Kurs #stopsprawdzam”
- „Newsletter Psyche Waves”

Zapisz numery (ID) obu list.

## Krok 4: szablon wiadomości z linkiem potwierdzającym

Brevo wymaga szablonu typu „double opt-in”. Instrukcja Brevo: [Create a custom double opt-in (DOI) email template](https://help.brevo.com/hc/en-us/articles/360019540880). Szablon musi zawierać link potwierdzający (zmienna `{{ params.DOIurl }}`). Zapisz numer (ID) szablonu.

Propozycja treści:

> **Temat:** Potwierdź zapis
>
> Cześć,
>
> ten adres został wpisany w formularzu zapisu na stronie stopsprawdzam.pl albo psychewaves.pl. Żeby zapis był ważny, kliknij link:
>
> [Potwierdzam zapis]({{ params.DOIurl }})
>
> Jeśli ten adres wpisał ktoś inny, zignoruj tę wiadomość. Bez kliknięcia nie dostaniesz żadnych kolejnych maili.
>
> Daniel
>
> Treści edukacyjne; nie zastępują konsultacji ze specjalistą. Administrator adresu: Daniel Różalski, kontakt@psychewaves.pl.

## Krok 5: kurs jako automatyzacja

W **Automations** utwórz przepływ:

1. **Wyzwalacz:** „Contact added to list” → „Kurs #stopsprawdzam”.
2. **Wiadomość 1** (od razu), potem **czekaj 1 dzień**, **wiadomość 2**, czekaj 1 dzień, itd. aż do wiadomości 7.
3. Treść wiadomości, tematy i stopka: `materialy/mini-kurs-stopsprawdzam/mini-kurs-stopsprawdzam.md` (po akceptacji szkicu).
4. **Nadawca:** „Placebo z #stopsprawdzam”, adres kontakt@psychewaves.pl. Adres do odpowiedzi: kontakt@psychewaves.pl.
5. **Śledzenie otwarć i kliknięć wyłącz**, jeśli Brevo na to pozwala w ustawieniach wiadomości lub konta. Polityka prywatności obiecuje, że wiadomości z kursu i newslettera tego nie robią. Jeśli na planie darmowym nie da się tego wyłączyć, napisz, a poprawię zdanie w polityce.
6. Godzina wysyłki: propozycja 8:00 (czas polski).

## Krok 6: klucz API

1. W Brevo: **SMTP & API** → **API keys** → **Generate a new API key** (nazwa np. „Strona”). Klucz pokazuje się tylko raz, skopiuj go.
2. W Netlify wejdź w **oba projekty** (`adorable-haupia-18a01f` dla psychewaves.pl i `stopsprawdzam`): **Project configuration** → **Environment variables** → **Add a variable**:

| Zmienna | Wartość |
|---|---|
| `BREVO_API_KEY` | klucz z Brevo (zaznacz jako sekretny) |
| `BREVO_DOI_TEMPLATE_ID` | numer szablonu z kroku 4 |
| `BREVO_LISTA_KURS` | numer listy „Kurs #stopsprawdzam” |
| `BREVO_LISTA_NEWSLETTER` | numer listy „Newsletter Psyche Waves” |

## Krok 7: test i włączenie

1. Najpierw sprawdź na podglądzie: dodaj `PUBLIC_ZAPISY_AKTYWNE=true` w Netlify tylko dla kontekstu **Deploy Previews**. Otwórz podgląd dowolnego PR-a, zapisz własny adres i przejdź całą drogę: wiadomość z linkiem, kliknięcie, strona „Zapis potwierdzony”, pierwszy mail kursu.
2. Gdy wszystko działa, dodaj `PUBLIC_ZAPISY_AKTYWNE=true` dla produkcji w obu projektach i uruchom nowe wdrożenie. Napisz do Claude, a pomoże.

## Zabezpieczenia i ograniczenia

- Funkcja przyjmuje zapisy tylko z własnych stron, ma ukryte pole pułapkę na boty i nie ujawnia, kto już jest zapisany.
- Nie ma limitu zapisów z jednego adresu IP. Ktoś mógłby wpisywać cudze adresy, ale dostaną one tylko jedną wiadomość z prośbą o potwierdzenie i na tym koniec. Jeśli to się zacznie nadużywać, dodamy CAPTCHA.
- Dotychczasowe formularze „Powiadom mnie” (sklep, Placebo Junior) nadal zbierają adresy w Netlify i niczego nie wysyłają. Nie importujemy ich do Brevo bez nowej zgody, bo ludzie zgodzili się na inne wiadomości.
