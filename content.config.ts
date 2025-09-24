// Arquivo: content/config.ts

import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// 1. Esquema base reutilizável
const pageSchema = z.object({
  title: z.string().optional(),
  date: z.string(),
  image: z.string().optional()
})

// 2. Esquema estendido para o blog
const blogSchema = pageSchema.extend({
  dateFormatted: z.string(),
  categories: z.array(z.string()).optional()
})

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
    sobre: defineCollection({
      type: 'page',
      source: 'sobre.md',
      schema: pageSchema // <-- Usa o esquema base novamente
    })
  }
})
