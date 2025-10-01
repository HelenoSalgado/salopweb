import { defineEventHandler } from 'h3'
import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug;

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Caminho é obrigatório'
    })
  }

  try {
    const page = await queryCollection(event, slug).first()

    if (!page) {
      throw createError({
        statusCode: 404,
        message: 'Página não encontrada'
      })
    }

    return page
  } catch (e) {
    throw createError({
      statusCode: 500,
      message: 'Erro na busca de conteúdo.'
    })
  }
})
