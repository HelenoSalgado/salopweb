import { defineTransformer } from '@nuxt/content'

export default defineTransformer({
  name: 'date-published',
  extensions: ['.md'],
  transform(file) {
    if (file.date) {
      const formatted = new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Sao_Paulo'
      }).format(new Date(file.date as string))
      // Cria um novo campo 'dateFormatted' em vez de sobrescrever 'date'
      file.dateFormatted = formatted
    }
    return file
  },
})
