# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Sobre o Projeto

Este é um projeto de blog desenvolvido com Nuxt.js, focado em performance, SEO e uma experiência de desenvolvimento moderna.

### Tecnologias Principais

*   **Nuxt.js:** Framework Vue.js para aplicações universais.
*   **Nuxt Content:** Módulo para gerenciar conteúdo baseado em arquivos (Markdown, YAML, CSV, JSON).
*   **Vue.js:** Framework progressivo para construção de interfaces de usuário.

### Funcionalidades Atuais

*   **Configuração Inicial:** Projeto Nuxt.js configurado.
*   **Componentes de Layout:** Cabeçalho (`TheHeader.vue`) e Rodapé (`TheFooter.vue`) com alternância de modo escuro.
*   **Navegação Responsiva:** Menu hambúrguer para dispositivos móveis.
*   **Listagem de Posts:** Página de blog com listagem de posts usando o componente `BlogPostCard`.
*   **Paginação:** Funcionalidade de paginação para navegar entre os posts.
*   **Conteúdo Dinâmico:** Integração com Nuxt Content para buscar e renderizar posts de arquivos Markdown.
*   **Estilização Modular:** Refatoração de CSS para usar arquivos modulares (`public/css/`) e variáveis globais, removendo estilos `scoped` dos componentes para melhor organização e reusabilidade.
*   **Front Matter:** Posts com `front matter` para título, descrição e imagem padrão.

### Estrutura de Estilos (Refatoração em Andamento)

O projeto está passando por uma refatoração de CSS para modularizar e organizar os estilos.

*   `public/css/reset.css`: Resets CSS globais.
*   `public/css/global.css`: Variáveis CSS globais e estilos base.
*   `public/css/BlogPostCard.css`: Estilos específicos para o componente `BlogPostCard`.
*   `public/css/Pagination.css`: Estilos específicos para o componente `Pagination`.
*   `app/assets/css/main.css`: Importa todos os arquivos CSS modulares.

### Próximos Passos (Refatoração CSS)

1.  **Aplicar Variáveis a `public/css/BlogPostCard.css`:** Substituir cores codificadas por variáveis globais genéricas.
2.  **Aplicar Variáveis a `public/css/Pagination.css`:** Substituir cores codificadas por variáveis globais genéricas.
3.  **Minimizar e Organizar:** Revisar arquivos CSS para redundância e garantir indentação limpa.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
