import { describe, it, expect, vi } from 'vitest';
import handler from '../../server/api/newsletter/subscribe.post';

function createMockEvent(body: any, cloudflareContext?: any, globalEnv?: any) {
  let statusCode = 200;
  return {
    node: {
      req: {
        method: 'POST',
      },
    },
    context: {
      cloudflare: cloudflareContext,
      _platform: cloudflareContext ? { cloudflare: cloudflareContext } : undefined,
    },
    setResponseStatus: (_event: any, status: number) => {
      statusCode = status;
    },
    getStatusCode: () => statusCode,
    _body: body,
  };
}

// Mock readBody and setResponseStatus from h3
vi.mock('h3', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    readBody: vi.fn(async (event: any) => event._body),
    setResponseStatus: vi.fn((event: any, status: number) => {
      if (event.setResponseStatus) {
        event.setResponseStatus(event, status);
      }
    }),
  };
});

describe('newsletter/subscribe handler', () => {
  it('returns 503 if DB is not available in context or global', async () => {
    const event = createMockEvent({ email: 'teste@exemplo.com' }, undefined);
    const result = await handler(event as any);
    expect(result).toEqual({
      success: false,
      message: 'Serviço de banco de dados temporariamente indisponível.',
    });
    expect(event.getStatusCode()).toBe(503);
  });

  it('validates invalid email format and returns 400', async () => {
    const mockDb = {
      prepare: vi.fn(),
    };
    const event = createMockEvent({ email: 'email-invalido' }, { env: { DB: mockDb } });
    const result = await handler(event as any);
    expect(result).toEqual({
      success: false,
      message: 'Por favor, insira um e-mail válido.',
    });
    expect(event.getStatusCode()).toBe(400);
  });

  it('returns 409 if email is already subscribed', async () => {
    const mockDb = {
      prepare: vi.fn().mockReturnValue({
        bind: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue({ id: 1 }),
        }),
      }),
    };
    const event = createMockEvent({ email: 'existente@exemplo.com' }, { env: { DB: mockDb } });
    const result = await handler(event as any);
    expect(result).toEqual({
      success: false,
      message: 'Este e-mail já está inscrito.',
    });
    expect(event.getStatusCode()).toBe(409);
  });

  it('subscribes new email successfully with status 201', async () => {
    const runMock = vi.fn().mockResolvedValue({ success: true });
    const firstMock = vi.fn().mockResolvedValue(null);
    const mockDb = {
      prepare: vi.fn().mockReturnValue({
        bind: vi.fn().mockReturnValue({
          first: firstMock,
          run: runMock,
        }),
      }),
    };
    const event = createMockEvent({ email: 'novo@exemplo.com' }, { env: { DB: mockDb } });
    const result = await handler(event as any);
    expect(result).toEqual({
      success: true,
      message: 'Inscrição realizada com sucesso!',
    });
    expect(event.getStatusCode()).toBe(201);
  });
});
