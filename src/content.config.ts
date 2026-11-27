import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const artykuly = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/artykuly' }),
  schema: z.object({
    tytul: z.string(),
    zajawka: z.string(),
    kategoria: z.string(),
    // dla kogo: dorośli (publikacje naukowe) albo dzieci i rodzice (Placebo Junior)
    odbiorca: z.enum(['dorosli', 'dzieci']).default('dorosli'),
    data: z.coerce.date(),
    czasCzytania: z.number(),
    // id tematu z src/data/tematy.yml; po publikacji temat znika z „W przygotowaniu”
    temat: z.string().optional(),
    // szkic: true = artykuł NIE pojawia się na żywej stronie (tylko w podglądzie)
    szkic: z.boolean().default(true),
    zrodlaDoWeryfikacji: z.boolean().default(false),
    zrodla: z.array(z.string()).default([]),
    // data ostatniej aktualizacji treści (pokazywana w nagłówku i w ramce „Jak powstał ten tekst”)
    aktualizacja: z.coerce.date().optional(),
    // warstwy: true = długi artykuł z rozwijanymi sekcjami, spisem treści, paskiem postępu i słowniczkiem w dymkach
    warstwy: z.boolean().default(false),
    // szybkieWyjscie: true = przycisk „Wyjdź szybko” (tematy wrażliwe, np. chemseks)
    szybkieWyjscie: z.boolean().default(false),
    // ramka „Jak powstał ten tekst”: kto recenzował (puste = brak recenzji zewnętrznej)
    recenzja: z.string().optional(),
  }),
});

export const collections = { artykuly };
