import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
const POMIN = ['/sklep/dziekuje/', '/404'];
const PODSTRONY_SKLEPU = ['/sklep/odziez/', '/sklep/materialy/', '/sklep/placebo-junior/'];

export default defineConfig({
  site: 'https://psychewaves.pl',
  integrations: [
    sitemap({
      filter: (adres) => {
        const sciezka = new URL(adres).pathname;
        if (POMIN.some((p) => sciezka.startsWith(p))) return false;
        if (!sklepOtwarty && PODSTRONY_SKLEPU.includes(sciezka)) return false;
        return true;
      },
    }),
  ],
  markdown: { rehypePlugins: [rehypePoziomPewnosci] },
});
