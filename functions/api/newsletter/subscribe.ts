import { z } from 'zod';

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<{ success: boolean }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Env {
  DB: D1Database;
}

interface EventContext<Env, P extends string, Data> {
  request: Request;
  env: Env;
  params: Record<P, string | string[]>;
  data: Data;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
}

type PagesFunction<Env = unknown, P extends string = string, Data = Record<string, unknown>> = (
  context: EventContext<Env, P, Data>
) => Response | Promise<Response>;

const emailSchema = z.string().email({ message: 'Por favor, insira um e-mail válido.' });

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      ...jsonHeaders,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const DB = env?.DB;

  if (!DB) {
    return new Response(
      JSON.stringify({ success: false, message: 'Serviço de banco de dados temporariamente indisponível.' }),
      { status: 503, headers: jsonHeaders }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    const email = body?.email;

    emailSchema.parse(email);

    const existingSubscriber = await DB.prepare('SELECT id FROM newsletter_subscribers WHERE email = ?')
      .bind(email)
      .first();

    if (existingSubscriber) {
      return new Response(
        JSON.stringify({ success: false, message: 'Este e-mail já está inscrito.' }),
        { status: 409, headers: jsonHeaders }
      );
    }

    await DB.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)')
      .bind(email)
      .run();

    return new Response(
      JSON.stringify({ success: true, message: 'Inscrição realizada com sucesso!' }),
      { status: 201, headers: jsonHeaders }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ success: false, message: error.issues[0]?.message || 'E-mail inválido.' }),
        { status: 400, headers: jsonHeaders }
      );
    }

    console.error('Erro na inscrição da newsletter:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Ocorreu um erro inesperado.' }),
      { status: 500, headers: jsonHeaders }
    );
  }
};
