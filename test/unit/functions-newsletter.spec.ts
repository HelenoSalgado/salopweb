import { describe, it, expect, vi } from 'vitest';
import { onRequestPost, onRequestOptions } from '../../functions/api/newsletter/subscribe';

function createMockContext(body: any, env?: any) {
  const request = new Request('https://heleno.dev/api/newsletter/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return {
    request,
    env: env || {},
    params: {},
    data: {},
    waitUntil: vi.fn(),
    next: vi.fn(),
  };
}

describe('functions/api/newsletter/subscribe', () => {
  it('handles OPTIONS preflight', async () => {
    const res = await onRequestOptions({} as any);
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST');
  });

  it('returns 503 if DB is missing', async () => {
    const context = createMockContext({ email: 'teste@exemplo.com' });
    const res = await onRequestPost(context as any);
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.message).toBe('Serviço de banco de dados temporariamente indisponível.');
  });

  it('returns 400 for invalid email', async () => {
    const mockDb = { prepare: vi.fn() };
    const context = createMockContext({ email: 'invalido' }, { DB: mockDb });
    const res = await onRequestPost(context as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.message).toBe('Por favor, insira um e-mail válido.');
  });

  it('returns 409 if email already exists', async () => {
    const mockDb = {
      prepare: vi.fn().mockReturnValue({
        bind: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue({ id: 1 }),
        }),
      }),
    };
    const context = createMockContext({ email: 'existente@exemplo.com' }, { DB: mockDb });
    const res = await onRequestPost(context as any);
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.message).toBe('Este e-mail já está inscrito.');
  });

  it('inserts and returns 201 for new subscriber', async () => {
    const runMock = vi.fn().mockResolvedValue({ success: true });
    const mockDb = {
      prepare: vi.fn().mockReturnValue({
        bind: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(null),
          run: runMock,
        }),
      }),
    };
    const context = createMockContext({ email: 'novo@exemplo.com' }, { DB: mockDb });
    const res = await onRequestPost(context as any);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toBe('Inscrição realizada com sucesso!');
  });
});
