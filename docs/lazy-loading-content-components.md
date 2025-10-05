# Lazy-Loading de Componentes no Nuxt Content

## Problema

Componentes de conteúdo (utilizados dentro de arquivos Markdown), como `Callout.vue`, estavam sendo incluídos no bundle principal de todas as páginas que renderizavam conteúdo, mesmo que o componente não fosse utilizado no corpo do post.

A tentativa de usar a sintaxe `::LazyCallout` para carregamento assíncrono não funcionava quando o componente residia em `app/components/content/`, resultando no não carregamento do componente.

## Solução

A solução foi mover o componente em questão (ex: `Callout.vue`) para um diretório `global` dentro de `app/components/` (ex: `app/components/global/Callout.vue`).

Ao fazer isso, o sistema do Nuxt passou a resolver corretamente o componente quando utilizado com o prefixo `Lazy` no Markdown (`::LazyCallout`). Isso ativou o comportamento de lazy-loading esperado, fazendo com que o JavaScript do componente seja baixado apenas nas páginas que efetivamente o utilizam.

**Conclusão:** Para garantir o lazy-loading de componentes usados pelo Nuxt Content, eles devem ser colocados em um diretório que permita a resolução correta pelo prefixo `Lazy`, como o `app/components/global/`.
