# psychewaves.pl

Strona Psyche Waves: psychoedukacja bez wstydu.

## Jak dodać artykuł

1. Napisz do Claude'a: „Nowy artykuł: [temat]” i dołącz tekst albo notatki.
2. Claude przygotuje propozycję zmian (Pull Request). Żywa strona się nie zmienia.
3. Netlify doda w PR link do podglądu. Przeczytaj artykuł tak, jak będzie wyglądał.
4. Poprawki: napisz Claude'owi albo edytuj plik na GitHubie (ikona ołówka).
5. Odhacz checklistę w PR, w tym nowy temat w kolejce.
6. Kliknij **Merge**. Po 1–2 minutach artykuł jest na psychewaves.pl.

## Jak działa „W przygotowaniu”

Plik `src/data/tematy.yml` to kolejka tematów. Strona pokazuje 3 pierwsze, które nie mają jeszcze opublikowanego artykułu. Gdy publikujesz artykuł z polem `temat: <id>`, ten temat znika, a na jego miejsce wskakuje następny.

## Format artykułu

Plik `src/content/artykuly/nazwa-artykulu.md`. Nazwa pliku = adres strony (`/artykuly/nazwa-artykulu/`).

```markdown
---
tytul: "Tytuł artykułu"
zajawka: "Jedno–dwa zdania pod tytułem."
kategoria: "ADHD"
data: 2026-11-03
czasCzytania: 6
temat: chemseks          # id z tematy.yml
szkic: true              # zmień na false przy akceptacji
zrodlaDoWeryfikacji: true
zrodla:
  - "Autor, A. (2021). Tytuł. <em>Czasopismo, 1</em>, 1–10."
---

### Impuls
## Nagłówek
Tekst…

- `Wiemy` Twierdzenie dobrze zbadane.
- `Badania sugerują` Twierdzenie prawdopodobne.
- `Hipoteza` Twierdzenie niepewne.

> „Gotowe zdanie do użycia.”
```
