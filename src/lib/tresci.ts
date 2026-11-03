import { getCollection } from 'astro:content';
import yaml from 'js-yaml';
import tematyRaw from '../data/tematy.yml?raw';

export const WIDOCZNE_TEMATY = 3;

// Na żywej stronie (Netlify production) szkice są ukryte.
// W podglądach (deploy preview) i lokalnie są widoczne z oznaczeniem „Szkic”.
export const pokazujSzkice = process.env.CONTEXT !== 'production';

type Temat = { id: string; tytul: string; kategoria: string };

export async function artykuly() {
  const all = await getCollection('artykuly', (a) => pokazujSzkice || !a.data.szkic);
  return all.sort((a, b) => b.data.data.getTime() - a.data.data.getTime());
}

export async function tematyWPrzygotowaniu() {
  const tematy = (yaml.load(tematyRaw) as Temat[]) ?? [];
  const opublikowane = new Set(
    (await getCollection('artykuly', (a) => !a.data.szkic)).map((a) => a.data.temat).filter(Boolean),
  );
  const czekajace = tematy.filter((t) => !opublikowane.has(t.id));
  if (czekajace.length < WIDOCZNE_TEMATY) {
    console.warn(`\n⚠  W kolejce zostało tylko ${czekajace.length} tematów. Dopisz nowe w src/data/tematy.yml.\n`);
  }
  return czekajace.slice(0, WIDOCZNE_TEMATY);
}
