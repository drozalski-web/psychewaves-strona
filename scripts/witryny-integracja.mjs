// Integracja Astro: po zbudowaniu zostawia w dist/ tylko strony właściwej domeny, poprawia odnośniki
// i zapisuje _redirects oraz robots.txt. Przy domyślnej budowie psychewaves.pl (sklep nieprzeniesiony) nic nie robi.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ADRES_PW, ADRES_SS, czescStopsprawdzam, wspolne, przepiszAdres } from '../src/lib/witryny.mjs';

// Działy psychewaves.pl, które na stopsprawdzam.pl przekierowujemy na psychewaves.pl.
const DZIALY_PW = ['publikacje', 'placebo-junior', 'placebo', 'o-mnie', 'kontakt', 'wspolpraca'];

function plikiHtml(katalog) {
  return fs.readdirSync(katalog, { withFileTypes: true }).flatMap((w) => {
    const p = path.join(katalog, w.name);
    if (w.isDirectory()) return plikiHtml(p);
    return w.name.endsWith('.html') ? [p] : [];
  });
}

function sciezkaStrony(root, plik) {
  const rel = path.relative(root, plik).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel.replace(/\.html$/, '')}`;
}

function usunPusteKatalogi(katalog) {
  for (const w of fs.readdirSync(katalog, { withFileTypes: true })) {
    if (w.isDirectory()) usunPusteKatalogi(path.join(katalog, w.name));
  }
  if (fs.readdirSync(katalog).length === 0) fs.rmdirSync(katalog);
}

export default function witryny(ust) {
  return {
    name: 'psychewaves-witryny',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        if (!ust.sklepPrzeniesiony) return;
        const root = fileURLToPath(dir);
        let usuniete = 0;

        for (const plik of plikiHtml(root)) {
          const p = sciezkaStrony(root, plik);
          const zostaje = ust.naStopsprawdzam ? czescStopsprawdzam(p) || wspolne(p) : !czescStopsprawdzam(p);
          if (!zostaje) { fs.rmSync(plik); usuniete++; }
        }
        if (ust.naStopsprawdzam) {
          // Strona akcji staje się stroną główną stopsprawdzam.pl.
          fs.renameSync(path.join(root, 'stopsprawdzam', 'index.html'), path.join(root, 'index.html'));
        }
        for (const w of fs.readdirSync(root, { withFileTypes: true })) {
          if (w.isDirectory()) usunPusteKatalogi(path.join(root, w.name));
        }

        for (const plik of plikiHtml(root)) {
          const html = fs.readFileSync(plik, 'utf8');
          const nowy = html.replace(/(\shref=")([^"]+)(")/g, (_, a, href, z) => a + przepiszAdres(href, ust) + z);
          if (nowy !== html) fs.writeFileSync(plik, nowy);
        }

        const linie = ust.naStopsprawdzam
          ? [
              '/stopsprawdzam  /  301',
              '/stopsprawdzam/*  /  301',
              `/artykuly  ${ADRES_PW}/publikacje/  301`,
              `/artykuly/*  ${ADRES_PW}/publikacje/:splat  301`,
              // Dawny adres sklepu Placebo Junior (sklep Junior jest teraz w wyspie Junior na psychewaves.pl).
              `/sklep/placebo-junior  ${ADRES_PW}/placebo-junior/sklep/  301`,
              ...DZIALY_PW.flatMap((d) => [`/${d}  ${ADRES_PW}/${d}/  301`, `/${d}/*  ${ADRES_PW}/${d}/:splat  301`]),
            ]
          : [
              `/stopsprawdzam  ${ADRES_SS}/  301`,
              `/stopsprawdzam/*  ${ADRES_SS}/  301`,
              // Dawny adres sklepu Placebo Junior: ma pierwszeństwo przed regułą /sklep/* poniżej.
              '/sklep/placebo-junior  /placebo-junior/sklep/  301',
              `/sklep  ${ADRES_SS}/sklep/  301`,
              `/sklep/*  ${ADRES_SS}/sklep/:splat  301`,
            ];
        fs.writeFileSync(path.join(root, '_redirects'), `${linie.join('\n')}\n`);

        if (ust.naStopsprawdzam) {
          fs.writeFileSync(path.join(root, 'robots.txt'),
            `User-agent: *\nAllow: /\nDisallow: /sklep/dziekuje/\n\nSitemap: ${ADRES_SS}/sitemap-index.xml\n`);
        }
        logger.info(`${ust.naStopsprawdzam ? 'stopsprawdzam.pl' : 'psychewaves.pl (sklep przeniesiony)'}: usunięto ${usuniete} stron, zapisano _redirects`);
      },
    },
  };
}
