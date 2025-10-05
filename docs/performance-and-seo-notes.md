# Notas sobre Performance e SEO

Este documento resume as otimizações de performance aplicadas ao `nuxt.config.ts` e discute os desafios de SEO em aplicações híbridas como este projeto.

---

## 1. Otimizações de Performance em `nuxt.config.ts`

O objetivo destas configurações é reduzir o número de requisições ao servidor, diminuir o tamanho do payload enviado ao cliente e otimizar o cache de assets.

### a. Agrupamento de Módulos (Chunking)

Para minimizar o número de arquivos baixados pelo navegador, agrupamos o JavaScript e o CSS em arquivos únicos.

- **JavaScript (Vendor Bundle):** Usando `vite.build.rollupOptions.output.manualChunks`, todas as dependências localizadas em `node_modules` são agrupadas em um único arquivo (`vendor.js`). Isso melhora a eficiência do cache, já que as bibliotecas de terceiros raramente mudam.

- **CSS Unificado:** Com `vite.build.cssCodeSplit: false`, todo o CSS da aplicação é compilado em um único arquivo. Isso evita múltiplas requisições para pequenos arquivos de estilo.

### b. Otimização de Fontes (Google Fonts)

Para diminuir o número de arquivos de fontes baixados, a configuração `googleFonts.subsets` foi alterada para conter apenas `['latin-ext']`. Este subconjunto geralmente inclui os caracteres do `latin` padrão, efetivamente reduzindo pela metade o número de variações de fontes necessárias.

### c. Redução do Payload do Cliente (Nuxt Content)

A opção `experimental.clientQueries` foi removida em versões recentes do `@nuxt/content`. A abordagem correta, que foi implementada, é usar um hook do Nuxt para substituir o bundle de queries do cliente por um módulo vazio. Isso é feito no `nuxt.config.ts` através do hook `vite:extendConfig`, que cria um alias de `@nuxt/content/runtime/query.client.mjs` para `@nuxt/content/runtime/query.noop.mjs` quando o build é para o cliente (`isClient`). O resultado é o mesmo: o motor de queries não é incluído no bundle do cliente, reduzindo seu tamanho.

### d. Estratégia de Cache de Assets

Foram definidas regras em `nitro.routeRules` para adicionar cabeçalhos `Cache-Control` a todos os assets na pasta `/_nuxt/`, `/css/` e `/images/`. Isso instrui o navegador a fazer um cache agressivo desses arquivos por um longo período (`max-age=31536000`), melhorando drasticamente a velocidade de carregamento para visitantes recorrentes.

---

## 2. Desafios de SEO em Aplicações Híbridas (Nuxt)

Nosso projeto usa uma abordagem híbrida, combinando renderização no lado do servidor (SSR) para a primeira visita com navegação no lado do cliente (SPA) para interações subsequentes. Isso traz desafios específicos para SEO.

### a. Hidratação (Hydration)

A hidratação é o processo no qual o Vue.js "ativa" o HTML estático enviado pelo servidor, tornando-o interativo. Se houver uma mínima diferença (mismatch) entre o que o servidor rendenizou e o que o cliente renderiza, podem ocorrer erros. Para os crawlers, isso pode significar ver um conteúdo quebrado ou diferente do usuário final, o que prejudica a indexação.

### b. Conteúdo Renderizado no Cliente (CSR)

Qualquer conteúdo que seja buscado e renderizado exclusivamente no cliente (após o carregamento inicial da página) corre o risco de não ser visto pelos crawlers. Embora o Googlebot seja bom em executar JavaScript, outros buscadores não são. Por isso, é crucial usar os composables `useAsyncData` ou `useFetch` do Nuxt para garantir que os dados essenciais sejam renderizados no servidor.

### c. Core Web Vitals e Performance

O Google usa as métricas de Core Web Vitals como um fator de ranqueamento. Em um app híbrido, o tamanho do bundle JavaScript é um grande vilão, pois pode atrasar a Interatividade da Página (Time to Interactive - TTI). As otimizações de chunking que fizemos ajudam a mitigar isso, mas é um ponto de atenção constante.

### d. Gerenciamento de Metadados

É fundamental garantir que cada página tenha metadados únicos e precisos (`<title>`, `<meta name="description">`, `link rel="canonical"`). Em uma SPA, a transição entre páginas ocorre no cliente, então o Nuxt precisa garantir que esses metadados sejam atualizados dinamicamente a cada navegação de rota para que o conteúdo compartilhado em redes sociais ou salvo seja o correto.
