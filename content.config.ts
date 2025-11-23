import { defineCollection, defineContentConfig, z } from '@nuxt/content';

// 1. Esquema base reutilizável
const pageSchema = z.object({
  title: z.string().optional(),
  date: z.string(),
  dateFormatted: z.string(),
  image: z.string().optional(),
  path: z.string().optional()
})

// 2. Esquema estendido para o blog
const blogSchema = pageSchema.extend({
  dateFormatted: z.string(),
  categories: z.array(z.string()).optional(),
  slugified_categories: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  author: z.string().optional(),
  mathfont: z.boolean().optional()
})

// Esquema para podcasts
const podcastSchema = pageSchema.extend({
  description: z.string(),
  audioSrc: z.string(),
  duration: z.string().optional(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  published: z.boolean().optional(),
  categories: z.array(z.string()).optional(),
  slugified_categories: z.array(z.string()).optional()
});

// 3. Configuração final
export default defineContentConfig({
  collections: {
    home: defineCollection({
      type: 'page',
      source: 'index.md',
      schema: pageSchema // <-- Usa o esquema base
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: blogSchema // <-- Usa o esquema estendido
    }),
    podcasts: defineCollection({
      type: 'page',
      source: 'podcast/**/*.md',
      schema: podcastSchema
    }),
    sobre: defineCollection({
      type: 'page',
      source: 'sobre.md',
      schema: pageSchema // <-- Usa o esquema base novamente
    })
  }
})
