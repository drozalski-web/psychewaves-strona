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

## Struktura

- `src/content/artykuly/*.md`: artykuły (frontmatter: tytul, zajawka, kategoria, data, czasCzytania, temat, szkic, zrodlaDoWeryfikacji, zrodla)
- `src/data/tematy.yml`: kolejka tematów „W przygotowaniu”; widać 3 pierwsze bez opublikowanego artykułu
- W treści: `### Impuls|Nauka|Wodnik|Wniosek` = etykieta części, `## …` = nagłówek, `` `Wiemy` `` / `` `Badania sugerują` `` / `` `Hipoteza` `` = plakietki pewności, `> …` = gotowe zdanie
- `npm run dev` lokalnie, `npm run build` buduje do `dist/`
