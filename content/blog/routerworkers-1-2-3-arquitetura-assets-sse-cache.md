---
title: "RouterWorkers 1.2.3: Assets Nativos, Streaming SSE e Invalidação de Cache em Cloudflare Workers"
description: "Uma análise técnica das novidades do RouterWorkers 1.2.3 e como aplicá-las em uma API na borda para eliminar boilerplate, gambiarras de tipagem e bugs silenciosos de cache e streams."
date: '2026-11-16'
categories:
   - Tecnologia
   - Cloudflare
   - Performance
   - Desenvolvimento
published: true
---

Quando publiquei a primeira versão do [RouterWorkers](/blog/routerworkers), o objetivo central era claro: oferecer um roteador minimalista, com zero dependências externas e foco absoluto em *Cold Start* e baixa pegada de memória para **Cloudflare Workers**.

Contudo, à medida que uma API cresce — exigindo distribuição de arquivos estáticos protegidos (`env.ASSETS`), respostas em *streaming* via *Server-Sent Events* (SSE), cabeçalhos estritos de segurança e invalidação cruzada de cache na borda —, um roteador básico começa a exigir contornos manuais. O código passa a acumular interceptações fora do roteador para lidar com *preflights* (`OPTIONS`) e arquivos estáticos, clonagens redundantes de `Response` e malabarismos para enviar *streams* ou invalidar rotas parametrizadas.

A versão **`routerworkers@1.2.3`** foi desenhada para resolver esses gargalos de forma nativa, mantendo zero dependências. Para demonstrar cada melhoria com clareza, vamos construir e evoluir uma API hipotética de publicações que serve artigos cacheados, notificações, um chat em *streaming* (SSE) e documentos privados via `env.ASSETS`.

---

## 1. Tipagem Oficial Nativa (`dist/index.d.ts`)

Na versão `1.2.3`, o pacote exporta `dist/index.d.ts` diretamente na raiz com todos os tipos públicos (`Req`, `Res`, `ConfigWorker`, `RouteGroup`, `AssetsOptions`, `SecurityHeadersOptions`, `Middleware`, `RouteHandler`).

Os métodos de resposta suportam genéricos (`res.ok<T>()`, `res.json<T>()`), e a interface mutável `Req` já expõe `req.pathname`, `req.queries`, `req.params`, `req.bodyJson` e permite anexar estados de middlewares (como `req.user`) sem necessidade de arquivos `.d.ts` manuais no projeto:

```bash
npm install routerworkers@1.2.3
```

---

## 2. Unificação de Static Assets (`app.assets`), Security Headers e CORS

Em Workers que combinam rotas de API (`/api/*`) com arquivos estáticos (`env.ASSETS`), uma armadilha comum é tratar `OPTIONS` e o binding `env.ASSETS` fora do roteador:

```typescript
// ❌ Antes: Lógica fragmentada fora do roteador
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. Preflight manual fora do roteador
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: buildCorsHeaders(request) });
    }

    // 2. Desvio manual para a API
    if (url.pathname.startsWith("/api")) {
      return handleApi(request, env);
    }

    // 3. Servir assets e clonar Response manualmente para injetar headers
    if (env.ASSETS) {
      if (url.pathname.startsWith("/private/")) {
        const authorized = await checkAuth(request);
        if (!authorized) return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      const res = await env.ASSETS.fetch(request);
      const headers = new Headers(res.headers);
      headers.set("Cache-Control", "public, max-age=604800, immutable");
      headers.set("X-Content-Type-Options", "nosniff");
      return new Response(res.body, { status: res.status, headers });
    }

    return new Response("Not Found", { status: 404 });
  },
};
```

Na `1.2.3`, todo esse fluxo é unificado dentro do próprio `RouterWorkers` por meio de três recursos:

1. **`securityHeaders()`**: middleware que aplica cabeçalhos defensivos (`X-Content-Type-Options: nosniff`, `Cross-Origin-Resource-Policy`, `X-Frame-Options`, `Referrer-Policy`, `Strict-Transport-Security`) em todas as respostas.
2. **`cors()` com `Vary: Origin` automático**: quando a origem configurada não é `'*'`, adiciona `Vary: Origin` automaticamente e injeta os cabeçalhos de permissão apenas para origens validadas.
3. **`await app.assets(env.ASSETS, options)`**: serve arquivos estáticos diretamente pelo roteador, suportando exclusão de prefixos (`excludePrefixes: ['/api']`), `cacheControl` automático em respostas `2xx` e **`guards`** de autorização por prefixo.

Veja como a mesma API fica unificada em um único pipeline:

```typescript
// ✅ Agora na v1.2.3: Pipeline único para CORS, Security Headers, API e Assets
import {
  RouterWorkers,
  cors,
  group,
  securityHeaders,
  type Req,
  type Res,
} from "routerworkers";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const app = new RouterWorkers(request);

    // 1. Middlewares globais (aplicados a rotas, preflights e assets)
    await app.use(
      securityHeaders({ crossOriginResourcePolicy: "cross-origin" }),
      cors({
        origin: ["https://meusite.com", "http://localhost:3000"],
        methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      }),
    );

    // 2. Rotas da API
    await group(app, { prefix: "/api" }, async (api) => {
      await api.get("/health", (_req: Req, res: Res) => {
        res.ok({ status: "ok" });
      });
    });

    // 3. Static Assets com proteção para /private/* e cache imutável
    await app.assets(env.ASSETS, {
      excludePrefixes: ["/api"],
      cacheControl: "public, max-age=604800, immutable",
      guards: [
        {
          prefix: "/private/",
          unauthorizedMessage: "Autenticação necessária para acessar este arquivo.",
          authorize: async (req: Req) => {
            const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
            return Boolean(token && (await verifyToken(token, env)));
          },
        },
      ],
    });

    app.notFound((_req: Req, res: Res) => {
      res.notFound("Rota não encontrada");
    });

    return app.resolve();
  },
};
```

---

## 3. Streaming SSE (`res.sse`) e Payloads Binários (`res.stream`)

Em versões anteriores, passar uma `ReadableStream` ou `Uint8Array` para `res.send(stream)` fazia com que o valor caísse na verificação genérica `typeof data === 'object'`, sendo convertido incorretamente em `{}` por `Response.json()`. Para contornar isso, era necessário manipular diretamente `app.response = new Response(stream, ...)`.

Na versão `1.2.3`:
- `res.send()` preserva nativamente `ReadableStream`, `Blob`, `ArrayBuffer`, `Uint8Array` (e demais `ArrayBufferView`), `FormData`, `URLSearchParams` e `Response`;
- `res.stream(stream, config)` envia qualquer `ReadableStream` com `status` e `headers` customizados;
- **`res.sse(stream, headers?)`** configura automaticamente uma resposta *Server-Sent Events* com `Content-Type: text/event-stream; charset=utf-8`, `Cache-Control: no-cache, no-transform` e `Connection: keep-alive`.

```typescript
await api.post("/chat", async (req: Req, res: Res) => {
  const { prompt } = req.bodyJson ?? {};
  if (!prompt) {
    res.badRequest("O campo 'prompt' é obrigatório.");
    return;
  }

  const stream = await generateAiResponseStream(prompt);

  // Responde como Server-Sent Events em uma única linha
  res.sse(stream);
});
```

---

## 4. Invalidação de Cache Parametrizado e Cross-Route (`res.removeCache`)

O sistema de cache na borda do RouterWorkers recebeu três melhorias importantes na `1.2.3`:

1. **Atalho direto em `res.removeCache(pathname?)`**: permite invalidar o cache diretamente de dentro do handler ou controller sem precisar ter a instância `app` em mãos.
2. **Suporte a rotas parametrizadas no `ConfigWorker`**: chamar `await res.removeCache('/api/posts/42/comments')` agora casa corretamente com a regra parametrizada `'/api/posts/:id/comments,60'`.
3. **Invalidação Cross-Route real**: quando uma mutação em uma rota precisa invalidar o cache de outra rota (por exemplo, `POST /api/notifications/:id/read` invalidando `GET /api/notifications`), o `removeCache` constrói a chave de cache exata da rota alvo em vez de usar a URL da requisição atual.

```typescript
const config: ConfigWorker = {
  cache: {
    pathname: [
      "/api/posts/:id/comments,60",
      "/api/notifications,300",
    ],
    maxage: "3600",
    version: env.CF_VERSION_METADATA?.id,
  },
};

const app = new RouterWorkers(request, config);

await group(app, { prefix: "/api" }, async (api) => {
  // 1. Invalidação de rota parametrizada
  await api.post("/posts/:id/comments", async (req: Req, res: Res) => {
    await saveComment(req.params?.id, req.bodyJson);
    await res.removeCache(`/api/posts/${req.params?.id}/comments`);
    res.created({ saved: true });
  });

  // 2. Invalidação Cross-Route (de /:id/read para /api/notifications)
  await api.post("/notifications/:id/read", async (req: Req, res: Res) => {
    await markNotificationAsRead(req.params?.id);
    await res.removeCache("/api/notifications");
    res.ok({ success: true });
  });
});
```

::Callout{type="attention"}
Em cenários de `CACHE HIT`, o `setCache` na versão `1.2.3` preserva integralmente o `status`, o corpo e os cabeçalhos originais da resposta armazenada (`response.clone()`), garantindo que cabeçalhos customizados e políticas de CORS sejam mantidos em todas as respostas cacheadas.
::

---

## 5. `req.pathname`, `req.queries` com UTF-8 e `RouteParser` Seguro

O objeto `req` já chega aos middlewares e handlers com `req.pathname` extraído e `req.queries` decodificado em UTF-8 (com conversão automática de números e booleanos e proteção contra *Prototype Pollution*), eliminando chamadas repetidas a `new URL(req.url)`:

```typescript
// GET /api/posts?search=caf%C3%A9&page=2
await api.get("/posts", async (req: Req, res: Res) => {
  const search = String(req.queries?.search ?? ""); // "café"
  const page = Number(req.queries?.page ?? 1);      // 2
  const pathname = req.pathname;                    // "/api/posts"

  const results = await searchPosts({ search, page });
  res.ok({ pathname, page, results });
});
```

Além disso, o motor interno de rotas (`RouteParser`) foi reescrito para operar segmento a segmento:
- Escapa automaticamente metacaracteres de expressão regular (`.`, `+`, `*`, `?`, `()`, `[]`) em rotas como `/api/articles.json`;
- Suporta segmentos de URL não-ASCII (`/categorias/filosofia-clássica`);
- Trata sequências percentuais malformadas (`%E0%A4%A`) retornando `404` com segurança em vez de derrubar o Worker com `URIError`.

---

## Conclusão

Uma boa biblioteca de infraestrutura deve absorver a complexidade acidental do runtime para que o código da aplicação permaneça limpo e previsível. Com o **`routerworkers@1.2.3`**, servimos arquivos estáticos protegidos, transmitimos eventos em tempo real via SSE e controlamos a invalidação de cache na borda sem *boilerplate* e sem adicionar uma única dependência externa ao projeto.

O pacote está disponível no [NPM](https://www.npmjs.com/package/routerworkers) e o código-fonte pode ser conferido no [GitHub](https://github.com/HelenoSalgado/routerworkers).
