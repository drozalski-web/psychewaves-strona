// Twarde spacje (polska typografia i zasady marki): po zbudowaniu strony w każdym pliku HTML w dist/
// zwykła spacja zamienia się na niełamliwą tam, gdzie wiersz nie powinien się łamać:
// - po jednoliterowych spójnikach i przyimkach (a, i, o, u, w, z): „i_badania”, „w_Polsce”,
// - w odwołaniach i skrótach przed liczbą: „s._51”, „art._14”, „ust._2”, „pkt_2”, „§_1”, „nr_3”,
// - w liczbach z jednostką i w liczbach z odstępami: „2024_r.”, „6,5_%”, „50_330”, „12_424_89_11”,
// - w cytowaniach przed rokiem: „(Bourne i_in.,_2015)”.
// Zmieniany jest tylko tekst między znacznikami; atrybuty, <script>, <style> i <pre> zostają bez zmian.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const NBSP = ' ';
const LITERA = 'A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż';

const REGULY = [
  // jednoliterowe wyrazy (dwa przebiegi, żeby objąć ciągi typu „i w”)
  [new RegExp(`(^|[\\s(„"«${NBSP}])([aiouwzAIOUWZ]) (?=[^\\s])`, 'g'), `$1$2${NBSP}`],
  [new RegExp(`(^|[\\s(„"«${NBSP}])([aiouwzAIOUWZ]) (?=[^\\s])`, 'g'), `$1$2${NBSP}`],
  // skróty przed liczbą
  [new RegExp(`(^|[^${LITERA}])(s|art|ust|pkt|nr|poz|rozdz|str|tel|ok|godz|tys)(\\.?) (?=\\d)`, 'g'), `$1$2$3${NBSP}`],
  [/§ (?=\d)/g, `§${NBSP}`],
  // liczba + liczba (tysiące, numery telefonów)
  [/(\d) (?=\d)/g, `$1${NBSP}`],
  // liczba + jednostka
  [new RegExp(`(\\d) (?=(r\\.|tys\\.|mln|mld|zł|%|godz\\.|min|lat|lata|osób|km|mg|ml)(?![${LITERA}]))`, 'g'), `$1${NBSP}`],
  // cytowanie: „Autor, 2024)”
  [/, (?=\d{4}[a-z]?[),;])/g, `,${NBSP}`],
];

export function twardeSpacje(tekst) {
  return REGULY.reduce((t, [re, zamiana]) => t.replace(re, zamiana), tekst);
}

export function przetworzHtml(html) {
  const czesci = html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<pre[\s\S]*?<\/pre>|<!--[\s\S]*?-->|<[^>]+>)/);
  return czesci.map((c, i) => (i % 2 === 1 ? c : twardeSpacje(c))).join('');
}

async function* plikiHtml(katalog) {
  for (const w of await readdir(katalog, { withFileTypes: true })) {
    const sciezka = join(katalog, w.name);
    if (w.isDirectory()) yield* plikiHtml(sciezka);
    else if (w.name.endsWith('.html')) yield sciezka;
  }
}

export default function twardeSpacjeIntegracja() {
  return {
    name: 'twarde-spacje',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        let ile = 0;
        for await (const plik of plikiHtml(fileURLToPath(dir))) {
          const stary = await readFile(plik, 'utf8');
          const nowy = przetworzHtml(stary);
          if (nowy !== stary) { await writeFile(plik, nowy); ile++; }
        }
        logger.info(`Twarde spacje: poprawiono ${ile} plików HTML.`);
      },
    },
  };
}
