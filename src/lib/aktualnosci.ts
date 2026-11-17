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

  lista.sort((x, y) => (y.data?.getTime() ?? 0) - (x.data?.getTime() ?? 0));
  const nowe = lista.slice(0, SKLEP_OTWARTY ? limit : 1);

  // Karty informacyjne, dopóki sklep jest zamknięty. Nowe produkty mają pierwszeństwo i wypierają je z listy.
  const info: Aktualnosc[] = SKLEP_OTWARTY ? [] : [
    { rodzaj: 'info', etykieta: 'Sklep', tytul: 'Sklep w budowie',
      opis: 'Koszulki, bluzy, torby i maskotka Placebo. Zapisz się, a dam Ci znać, gdy ruszy.',
      href: '/sklep/', obraz: '/placebo/fartuch/h3-usmiech-fartuch.webp' },
    { rodzaj: 'info', etykieta: 'Sklep z misją', tytul: 'Pomagamy wspólnie',
      opis: 'Część kwoty ze sprzedaży chcę oddawać na pomoc w zdrowiu psychicznym. Komu dokładnie, wybierzemy razem w głosowaniu.',
      href: '/sklep/', obraz: '/placebo/fartuch/h6-powaga-fartuch.webp' },
    { rodzaj: 'info', etykieta: 'Święta', tytul: 'Coś na święta',
      opis: 'Oryginalny prezent dla bliskich, którzy lubią mówić wprost. Zajrzyj do sklepu, gdy ruszy.',
      href: '/sklep/', obraz: '/aktualnosci/choinka.svg' },
  ];
  return [...nowe, ...info];
}
