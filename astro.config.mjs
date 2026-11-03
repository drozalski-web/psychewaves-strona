import { defineConfig } from 'astro/config';

// Zamienia `Wiemy`, `Badania sugerują`, `Hipoteza` (kod w linii) na plakietki poziomu pewności.
const POZIOMY = { 'Wiemy': 'claim', 'Badania sugerują': 'claim', 'Hipoteza': 'claim h' };
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

export default defineConfig({
  site: 'https://psychewaves.pl',
  markdown: { rehypePlugins: [rehypePoziomPewnosci] },
});
