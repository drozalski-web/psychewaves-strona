# Psyche Waves: strona psychewaves.pl

Statyczna strona w Astro, hosting Netlify. Właściciel: Daniel (student psychologii, Kraków).
Marka: skill `psycho-waves-brand` (paleta, czcionki, logo, głos, bezpieczeństwo), ale nazwa na stronie to **Psyche Waves** (Instagram @psychewaves.pl).

## Zasady, których nie wolno łamać

- **Nic nie trafia na `main` bez Pull Requesta. Nigdy nie scalaj PR-ów. Scala tylko Daniel. Merge = jego akceptacja.**
- Każdy nowy artykuł ma `szkic: true`, dopóki Daniel go nie zaakceptuje. Szkice są ukryte na produkcji (`CONTEXT=production`).
- Przy każdym artykule do publikacji zapytaj Daniela o nowy temat do kolejki i dopisz go na końcu `src/data/tematy.yml`.
- Nie zmyślaj źródeł. Niepewne oznaczaj `zrodlaDoWeryfikacji: true`.
- Treści po polsku. Bez diagnoz, bez obietnic wyleczenia, bez dawek substancji. Na końcu zawsze zastrzeżenie edukacyjne (dodawane automatycznie).

## Struktura

- `src/content/artykuly/*.md`: artykuły (frontmatter: tytul, zajawka, kategoria, data, czasCzytania, temat, szkic, zrodlaDoWeryfikacji, zrodla)
- `src/data/tematy.yml`: kolejka tematów „W przygotowaniu”; widać 3 pierwsze bez opublikowanego artykułu
- W treści: `### Impuls|Nauka|Wodnik|Wniosek` = etykieta części, `## …` = nagłówek, `` `Wiemy` `` / `` `Badania sugerują` `` / `` `Hipoteza` `` = plakietki pewności, `> …` = gotowe zdanie
- `npm run dev` lokalnie, `npm run build` buduje do `dist/`
