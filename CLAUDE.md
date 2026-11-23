# Psyche Waves: strona psychewaves.pl

Statyczna strona w Astro, hosting Netlify. Właściciel: Daniel (student psychologii, Kraków).
Marka: skill `psycho-waves-brand` (paleta, czcionki, logo, głos, bezpieczeństwo), ale nazwa na stronie to **Psyche Waves** (Instagram @psychewaves.pl).

## Zasady, których nie wolno łamać

- **Nic nie trafia na `main` bez Pull Requesta. Nigdy nie scalaj PR-ów. Scala tylko Daniel. Merge = jego akceptacja.**
- Każdy nowy artykuł ma `szkic: true`, dopóki Daniel go nie zaakceptuje. Szkice są ukryte na produkcji (`CONTEXT=production`).
- Przy każdym artykule do publikacji zapytaj Daniela o nowy temat do kolejki i dopisz go na końcu `src/data/tematy.yml`.
- Nie zmyślaj źródeł. Niepewne oznaczaj `zrodlaDoWeryfikacji: true`.
- Treści po polsku. Bez diagnoz, bez obietnic wyleczenia, bez dawek substancji. Na końcu zawsze zastrzeżenie edukacyjne (dodawane automatycznie).

## Jak pracujemy (repozytorium, publikacja, podłączenia)

- Repozytorium: `drozalski-web/psychewaves-strona` na GitHubie. Hosting: Netlify (projekt `adorable-haupia-18a01f`, domena psychewaves.pl). Konto GitHub jest połączone z claude.ai, a Claude GitHub App jest zainstalowana na koncie `drozalski-web`.
- **Claude prowadzi zmiany od początku do końca:** gałąź → commit → push → Pull Request z opisem według szablonu. PR otwieraj przez REST (`gh api repos/drozalski-web/psychewaves-strona/pulls …`), bo GraphQL (`gh pr create`) jest w sesjach zablokowany. **Daniel tylko ogląda podgląd Netlify z komentarza w PR i klika Merge.**
- **Najpierw sprawdzaj wszystko sam, dopiero potem angażuj Daniela.** Jeśli repozytorium nie ma w sesji albo push zwraca 403, wywołaj `add_repo` z dostępem `push`. Status wdrożeń sprawdzaj przez narzędzia Netlify, a ustawienia sesji przez `read_documentation`. Proś Daniela tylko o krok, którego naprawdę nie da się zrobić bez niego (np. zgoda w okienku, ustawienia konta), i podawaj wtedy jeden konkretny krok.
- Domena psychewaves.pl zwykle jest poza siecią sesji. Żeby obejrzeć stronę, zbuduj ją lokalnie (`npm ci && npm run build && npx astro preview`) i zrób zrzuty Playwrightem: komputer, telefon i tryb ciemny.
- Kolory w kodzie: turkus do tekstu to `#23727E` (kontrast WCAG AA), `#2F8F9D` tylko w logo, a `#4FB3BF` tylko w grafice (fala, kropla, punkty).
- Strona jest zawsze jasna, także przy trybie ciemnym w telefonie. Nie dodawaj trybu ciemnego, bo marka wymaga białego lub mglistego tła.

## Dwie domeny: psychewaves.pl i stopsprawdzam.pl

- Ten sam kod buduje dwie strony. **psychewaves.pl** (edukacja) to budowa domyślna. **stopsprawdzam.pl** (akcja #stopsprawdzam i sklep z odzieżą) to drugi projekt Netlify z tego samego repozytorium ze zmienną `PUBLIC_WITRYNA=stopsprawdzam`.
- Na stopsprawdzam.pl są tylko: strona akcji (`/stopsprawdzam/` staje się stroną główną `/`), `/sklep/*` (odzież i materiały dla dorosłych), `/polityka-prywatnosci/` i 404. Odnośniki do działów edukacyjnych zamieniają się przy budowie na adresy psychewaves.pl, a stare ścieżki przekierowują tam przez `_redirects`.
- `PUBLIC_SKLEP_NA_STOPSPRAWDZAM=true` ustawia się w projekcie psychewaves.pl **dopiero, gdy stopsprawdzam.pl działa**. Wtedy linki do sklepu i akcji prowadzą na nową domenę, a `/sklep/*` i `/stopsprawdzam/` przekierowują tam (stary adres `/sklep/placebo-junior/` przekierowuje do `/placebo-junior/sklep/`). Bez tej zmiennej psychewaves.pl buduje się z całym sklepem pod `/sklep/`.
- Logika: `src/lib/witryny.mjs` (które strony gdzie, przepisywanie odnośników), `scripts/witryny-integracja.mjs` (usuwanie stron, `_redirects`, `robots.txt` po budowie), `src/lib/witryna.ts` (stałe dla komponentów). W kodzie pisz zwykłe ścieżki (`/publikacje/`, `/sklep/`), a nie pełne adresy.
- **Wyspa Placebo Junior** (`/placebo-junior/*`, tylko psychewaves.pl): ma własny nagłówek, menu i stopkę (`<Base sekcja="junior">`), własny sklep `/placebo-junior/sklep/` (zamknięty razem ze sklepem; wtedy przekierowuje na stronę Junior) i własne podziękowanie `/placebo-junior/dziekuje/`. Strony Junior nie linkują do części dla dorosłych poza „autor: Psyche Waves” w stopce, a część dla dorosłych linkuje do Junior tylko w stopce („Dla rodziców”) i jednym blokiem na /placebo/. Produkty Junior nie trafiają do „Aktualności” na stronie głównej. Nowe strony Junior zawsze z `sekcja="junior"`, a nowe linki do Junior nie trafiają do menu dla dorosłych.
- Podgląd lokalny stopsprawdzam.pl: `$env:PUBLIC_WITRYNA='stopsprawdzam'; npm run build; npx astro preview`.

## Zapisy na newsletter (Brevo)

- Tylko **psychewaves.pl**. Formularz (`src/components/ZapisBrevo.astro` w `NewsletterBlok.astro`, bez JS i bez zewnętrznych skryptów) wysyła dane do funkcji Netlify `netlify/functions/zapis.mjs` (adres `/api/zapis`), a ta dodaje adres do Brevo z potwierdzeniem mailowym (zapis z „double opt-in”). Po zapisie: `/zapis/sprawdz-skrzynke/`, po kliknięciu linku w mailu: `/zapis/potwierdzono-newsletter/`, przy błędzie `/zapis/blad/`. Formularze są na stronie głównej i w Publikacjach.
- Zmienne środowiskowe w Netlify (tylko projekt psychewaves.pl, `adorable-haupia-18a01f`): `BREVO_API_KEY` (sekretna, wkleja ją Daniel, Claude jej nie dotyka), `BREVO_DOI_TEMPLATE_ID`, `BREVO_LISTA_NEWSLETTER`. Przełącznik `PUBLIC_ZAPISY_AKTYWNE=true` pokazuje formularze (bez niego są ukryte) i wymaga nowego wdrożenia.
- Brevo nie może śledzić otwarć ani kliknięć w tych wiadomościach: polityka prywatności to obiecuje.
- Funkcja akceptuje tylko żądania z psychewaves.pl (i podglądów jego projektu), ma pułapkę na boty (ukryte pole) i nie ujawnia, kto już jest zapisany.
- Mini-kurs mailowy #stopsprawdzam jest **wstrzymany** do decyzji Daniela, czy go w ogóle robić. Szkic jest w `materialy/mini-kurs-stopsprawdzam/` (roboczy PR), a na stronie nie ma po nim śladu. Gdyby wrócił, trzeba dodać drugą listę, formularz na stopsprawdzam.pl i wiersz w polityce prywatności.

## Struktura

- `src/content/artykuly/*.md`: artykuły (frontmatter: tytul, zajawka, kategoria, data, czasCzytania, temat, szkic, zrodlaDoWeryfikacji, zrodla)
- `src/data/tematy.yml`: kolejka tematów „W przygotowaniu”; widać 3 pierwsze bez opublikowanego artykułu
- W treści: `### Impuls|Nauka|Wodnik|Wniosek` = etykieta części, `## …` = nagłówek, `` `Wiemy` `` / `` `Badania sugerują` `` / `` `Hipoteza` `` = plakietki pewności, `> …` = gotowe zdanie
- `npm run dev` lokalnie, `npm run build` buduje do `dist/`
