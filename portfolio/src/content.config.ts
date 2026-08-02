import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts live in per-language folders (en/, pt/). The folder decides the
// language; `key` pairs an article with its translation across folders.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    key: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    cover: z.string(),
    image_credit: z.object({
      text: z.string(),
      url: z.string().optional(),
    }).optional(),
    tags: z.array(z.string()).optional(),
    language: z.string().optional(),
  }),
});

export const collections = { blog };
