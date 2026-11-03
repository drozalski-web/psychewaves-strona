import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const artykuly = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/artykuly' }),
  schema: z.object({
    tytul: z.string(),
    zajawka: z.string(),
    kategoria: z.string(),
    data: z.coerce.date(),
    czasCzytania: z.number(),
    // id tematu z src/data/tematy.yml; po publikacji temat znika z „W przygotowaniu”
    temat: z.string().optional(),
    // szkic: true = artykuł NIE pojawia się na żywej stronie (tylko w podglądzie)
    szkic: z.boolean().default(true),
    zrodlaDoWeryfikacji: z.boolean().default(false),
    zrodla: z.array(z.string()).default([]),
  }),
});

export const collections = { artykuly };
