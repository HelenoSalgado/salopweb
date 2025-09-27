import { defineEventHandler, getRouterParam } from 'h3'
import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug;

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    })
  }

  try {
    const page = await queryCollection(event, slug as any).first()

    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      })
    }

    return page
  } catch (e) {
    console.error(e);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching page content'
    })
  }
})
