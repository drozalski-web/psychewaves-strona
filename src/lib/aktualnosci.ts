import { artykuly } from './tresci';
import { produkty } from '../data/produkty';
import { wzory } from '../data/sklep';
import { SKLEP_OTWARTY } from '../data/sklep-config';

export type Aktualnosc = {
  rodzaj: 'produkt' | 'artykul' | 'info';
  etykieta: string;   // np. „Nowość w sklepie”
  tytul: string;
  opis: string;
  href: string;
  data?: Date;
  obraz?: string;
  przypiete?: boolean;
};

/**
 * Aktualności na stronie głównej: nowe produkty (wyróżnione), artykuły i komunikat „Sklep w budowie”.
 * Nowy produkt pojawia się tu sam, gdy w data/produkty.ts lub data/sklep.ts dostanie status „dostępne”/„dostepny” i datę dodania.
 */
export async function aktualnosci(limit = 3): Promise<Aktualnosc[]> {
  const lista: Aktualnosc[] = [];

  for (const p of produkty) {
    if (p.status !== 'dostepne' || !p.dodano) continue;
    const gadzet = p.rodzaj === 'gadzet';
    lista.push({
      rodzaj: 'produkt',
      etykieta: p.darmowy ? 'Nowa darmowa karta pracy' : gadzet ? 'Nowy gadżet w sklepie' : 'Nowość w sklepie',
      tytul: p.nazwa, opis: p.opis, data: new Date(p.dodano), obraz: p.obraz,
      href: p.grupa === 'junior' ? (gadzet ? '/placebo-junior/#gadzety' : '/placebo-junior/#karty-pracy') : '/sklep/materialy/',
    });
  }

  if (SKLEP_OTWARTY) {
    for (const w of wzory) {
      if (w.status !== 'dostepny' || !w.dodano) continue;
      lista.push({ rodzaj: 'produkt', etykieta: 'Nowość w sklepie', tytul: w.nazwa, opis: w.opis, data: new Date(w.dodano), obraz: w.obrazy[0].src, href: `/sklep/odziez/#${w.id}` });
    }
  }

  for (const odb of ['dorosli', 'dzieci'] as const) {
    for (const a of await artykuly(odb)) {
      lista.push({
        rodzaj: 'artykul',
        etykieta: (odb === 'dzieci' ? 'Placebo Junior · ' : '') + (a.data.szkic ? 'Szkic artykułu' : 'Nowy artykuł'),
        tytul: a.data.tytul, opis: a.data.zajawka, data: a.data.data,
        href: `${odb === 'dzieci' ? '/placebo-junior/' : '/publikacje/'}${a.id}/`,
      });
    }
  }

  lista.sort((x, y) => (y.data?.getTime() ?? 0) - (x.data?.getTime() ?? 0));

  const wynik = lista.slice(0, limit);
  if (!SKLEP_OTWARTY) {
    wynik.unshift({
      rodzaj: 'info', przypiete: true, etykieta: 'Sklep',
      tytul: 'Sklep w budowie', opis: 'Koszulki, bluzy, torby, materiały i maskotka Placebo. Zapisz się, a dam Ci znać, gdy ruszy.',
      href: '/sklep/', obraz: '/placebo/fartuch/h3-usmiech-fartuch.webp',
    });
    return wynik.slice(0, limit);
  }
  return wynik;
}
