import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    home: defineCollection({
      type: 'page',
      source: 'index.md',
      schema: z.object({
        date: z.string(),
        image: z.string()
      })
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        date: z.string(),
        image: z.string()
      })
    }),
    sobre: defineCollection({
      type: 'page',
      source: 'sobre.md',
      schema: z.object({
        date: z.string(),
        image: z.string()
      })
    })
  }
})
