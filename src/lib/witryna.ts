// Która strona jest budowana (psychewaves.pl czy stopsprawdzam.pl). Szczegóły: src/lib/witryny.mjs.
import { ustawienia, ADRES_PW, ADRES_SS } from './witryny.mjs';

const ust = ustawienia(import.meta.env);
export { ADRES_PW, ADRES_SS };
/** Budujemy stopsprawdzam.pl. */
export const NA_STOPSPRAWDZAM: boolean = ust.naStopsprawdzam;
/** Sklep i akcja mieszkają już na stopsprawdzam.pl (prawda na obu stronach po przeniesieniu). */
export const SKLEP_PRZENIESIONY: boolean = ust.sklepPrzeniesiony;
/** Marka, pod którą działa sklep. */
export const MARKA_SKLEPU = SKLEP_PRZENIESIONY ? '#stopsprawdzam' : 'Psyche Waves';
