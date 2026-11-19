import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import witryny from './scripts/witryny-integracja.mjs';
import { ustawienia, ADRES_PW, ADRES_SS, czescStopsprawdzam } from './src/lib/witryny.mjs';

// Ten sam kod buduje psychewaves.pl (domyślnie) albo stopsprawdzam.pl (PUBLIC_WITRYNA=stopsprawdzam). Zob. src/lib/witryny.mjs.
const ust = ustawienia(process.env);

// Zamienia `Wiemy`, `Badania sugerują`, `Hipoteza` (kod w linii) na plakietki poziomu pewności.
const POZIOMY = { 'Wiemy': 'claim w', 'Badania sugerują': 'claim', 'Hipoteza': 'claim h' };
function rehypePoziomPewnosci() {
  const walk = (node, parent) => {
    if (node.type === 'element' && node.tagName === 'code' && parent?.tagName !== 'pre') {
      const text = (node.children || []).map((c) => c.value || '').join('');
      if (POZIOMY[text]) {
        node.tagName = 'span';
        node.properties = { className: POZIOMY[text].split(' ') };
      }
    }
    (node.children || []).forEach((c) => walk(c, node));
  };
  return (tree) => walk(tree, null);
}

// Mapa strony dla wyszukiwarek: bez stron technicznych i bez podstron sklepu, dopóki sklep jest w budowie
// (pokazują wtedy tę samą treść co /sklep/). Szkiców nie ma w buildzie produkcyjnym, więc nie trafią do mapy.
const sklepOtwarty = process.env.PUBLIC_SKLEP_OTWARTY === 'true';
const POMIN = ['/sklep/dziekuje/', '/placebo-junior/dziekuje/', '/404'];
const PODSTRONY_SKLEPU = ['/sklep/odziez/', '/sklep/materialy/', '/placebo-junior/sklep/'];

export default defineConfig({
  site: ust.naStopsprawdzam ? ADRES_SS : ADRES_PW,
  integrations: [
    sitemap({
      filter: (adres) => {
        const sciezka = new URL(adres).pathname;
        if (POMIN.some((p) => sciezka.startsWith(p))) return false;
        if (!sklepOtwarty && PODSTRONY_SKLEPU.includes(sciezka)) return false;
        // Każda domena ma w mapie tylko swoje strony.
        if (ust.naStopsprawdzam) return czescStopsprawdzam(sciezka) || sciezka === '/polityka-prywatnosci/';
        if (ust.sklepPrzeniesiony) return !czescStopsprawdzam(sciezka);
        return true;
      },
      // Strona akcji jest na stopsprawdzam.pl stroną główną.
      serialize: (wpis) => {
        if (ust.naStopsprawdzam && new URL(wpis.url).pathname === '/stopsprawdzam/') wpis.url = `${ADRES_SS}/`;
        return wpis;
      },
    }),
    witryny(ust),
  ],
  markdown: { rehypePlugins: [rehypePoziomPewnosci] },
});
