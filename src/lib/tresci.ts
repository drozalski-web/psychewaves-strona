import { getCollection } from 'astro:content';
import yaml from 'js-yaml';
import tematyRaw from '../data/tematy.yml?raw';

export const WIDOCZNE_TEMATY = 3;

// Na żywej stronie (Netlify production) szkice są ukryte.
// W podglądach (deploy preview) i lokalnie są widoczne z oznaczeniem „Szkic”.
export const pokazujSzkice = process.env.CONTEXT !== 'production';

export type Odbiorca = 'dorosli' | 'dzieci';
type Temat = { id: string; tytul: string; kategoria: string; odbiorca?: Odbiorca };

export async function artykuly(odbiorca: Odbiorca = 'dorosli') {
  const all = await getCollection('artykuly', (a) => (pokazujSzkice || !a.data.szkic) && a.data.odbiorca === odbiorca);
  return all.sort((a, b) => b.data.data.getTime() - a.data.data.getTime());
}

export async function tematyWPrzygotowaniu(odbiorca: Odbiorca = 'dorosli') {
  const tematy = ((yaml.load(tematyRaw) as Temat[]) ?? []).filter((t) => (t.odbiorca ?? 'dorosli') === odbiorca);
  const opublikowane = new Set(
    (await getCollection('artykuly', (a) => !a.data.szkic)).map((a) => a.data.temat).filter(Boolean),
  );
  const czekajace = tematy.filter((t) => !opublikowane.has(t.id));
  if (czekajace.length < WIDOCZNE_TEMATY) {
    console.warn(`\n⚠  W kolejce (${odbiorca}) zostało tylko ${czekajace.length} tematów. Dopisz nowe w src/data/tematy.yml.\n`);
  }
  return czekajace.slice(0, WIDOCZNE_TEMATY);
}
