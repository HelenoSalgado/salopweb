import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { z } from 'zod'

// Define o esquema de validação para o e-mail
const emailSchema = z.string().email({ message: 'Por favor, insira um e-mail válido.' })

export default defineEventHandler(async (event) => {
  // Acessa o binding do D1 a partir do contexto do Cloudflare
  const DB = event.context.cloudflare.env.DB;

  try {
    const body = await readBody(event)
    const email = body.email

    // Valida o e-mail usando o esquema Zod
    emailSchema.parse(email)

    // Verifica se o e-mail já está inscrito
    const existingSubscriber = await DB.prepare('SELECT id FROM newsletter_subscribers WHERE email = ?')
      .bind(email)
      .first()

    if (existingSubscriber) {
      setResponseStatus(event, 409) // Conflict
      return { success: false, message: 'Este e-mail já está inscrito.' }
    }

    // Insere o novo e-mail no banco de dados
    await DB.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)')
      .bind(email)
      .run()

    setResponseStatus(event, 201) // Created
    return { success: true, message: 'Inscrição realizada com sucesso!' }

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      setResponseStatus(event, 400) // Bad Request
      return { success: false, message: error.errors[0].message }
    }

    console.error('Erro na inscrição da newsletter:', error)
    setResponseStatus(event, 500) // Internal Server Error
    return { success: false, message: 'Ocorreu um erro inesperado.' }
  }
})
