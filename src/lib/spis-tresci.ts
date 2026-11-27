// Spis treści i czasy czytania dla artykułów z warstwami (frontmatter `warstwy: true`).
// Czyta surową treść artykułu: `<h3>Etykieta</h3>` + `<h2 id="…">` to część (Impuls, Nauka, Wodnik, Wniosek, Źródła),
// kolejne `<h2 id="…">` to sekcje tej części. Treść w `<details class="rozwin">` liczy się tylko do „całości”.

const SLOW_NA_MINUTE = 200;

type Sekcja = { id: string; tytul: string; min: number };
type Czesc = { id: string; etykieta: string; tytul: string; sekcje: Sekcja[] };

const bezTagow = (s: string) => s.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ');
const slowa = (s: string) => bezTagow(s).split(/\s+/).filter(Boolean).length;
const bezRozwiniec = (s: string) => s.replace(/<details class="rozwin[\s\S]*?<\/details>/g, ' ');
const minuty = (n: number) => Math.max(1, Math.round(n / SLOW_NA_MINUTE));

export function spisTresci(body: string) {
  const czesci: Czesc[] = [];
  const naglowki = [...body.matchAll(/<h3>([^<]+)<\/h3>\s*<h2 id="([^"]+)">([\s\S]*?)<\/h2>|<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)];
  naglowki.forEach((m, i) => {
    const koniec = i + 1 < naglowki.length ? naglowki[i + 1].index! : body.length;
    const fragment = body.slice(m.index! + m[0].length, koniec);
    if (m[1]) {
      czesci.push({ etykieta: m[1].trim(), id: m[2], tytul: bezTagow(m[3]).trim(), sekcje: [] });
    } else if (czesci.length) {
      czesci[czesci.length - 1].sekcje.push({ id: m[4], tytul: bezTagow(m[5]).trim(), min: minuty(slowa(fragment)) });
    }
  });
  return {
    czesci,
    minSkrot: minuty(slowa(bezRozwiniec(body))),
    minCalosc: minuty(slowa(body)),
  };
}
