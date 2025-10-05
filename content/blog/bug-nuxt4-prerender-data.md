---
title: "Bug Fix: Links de Cards Redirecionando para o Mesmo Post"
description: "Este bug é específico para aplicações que usam componentes dinâmicos em loops - Especialmente relevante para blogs/listings com múltiplos cards/links"
categories:
    - Programação
    - Nuxt
date: 2025-10-05
published: true
---

## 📋 Resumo do Problema

Em ambiente de produção, todos os links dos cards de blog redirecionavam para um único post (sempre o último/mais recente), mesmo que o HTML gerado mostrasse URLs corretas no DevTools.

## 🔍 Diagnóstico

### Sintomas Observados:
- ✅ **Desenvolvimento**: Links funcionavam corretamente
- ❌ **Produção**: Todos os links redirecionavam para o último post
- ✅ **HTML**: DevTools mostravam URLs corretas (`href` diferentes)
- ❌ **Comportamento**: Cliques eram interceptados/redirecionados
- 🔍 **HTML Renderizado**: Todos os links tinham o mesmo `data-v-f4dff2e8=""` (CSS scoped)

### Evidência Crucial:
```html
<a data-v-f4dff2e8="" href="/blog/etica-a-nicomaco/livro-4" class="button" data-path="/blog/etica-a-nicomaco/livro-4">
  Leia Mais »
</a>
```

Todos os links compartilhavam o mesmo identificador de CSS scoped, indicando reutilização de componente.

## 🎯 Causa Raiz Identificada

**Configuração problemática em `nuxt.config.ts`:**
```typescript
experimental: {
  sharedPrerenderData: true,  // ← CULPADO
  // ...
}
```

### O que estava acontecendo:

1. **`sharedPrerenderData: true`** faz o Nuxt compartilhar dados de prerender entre rotas durante a geração estática
2. Durante o loop dos cards de posts (`v-for`), cada iteração sobrescrevia os dados compartilhados
3. O **último post** (mais recente) era processado por último, mantendo seus dados nos payloads compartilhados
4. Todos os links redirecionavam para esse último post por causa do estado compartilhado corrompido

## ✅ Solução Aplicada

**Mudança no `nuxt.config.ts`:**
```typescript
experimental: {
  // Desabilitado para evitar conflito de estado entre cards de posts
  // Com 'true', todos os links redirecionavam para o último post
  sharedPrerenderData: false,
  renderJsonPayloads: true,
  entryImportMap: true,
  asyncContext: true,
  lazyHydration: true,
  // ...
}
```

## 🧪 Método de Teste

### Para reproduzir o problema:
1. Configurar `sharedPrerenderData: true`
2. Fazer build: `npm run build`
3. Testar em produção: `npx wrangler pages dev dist`
4. Observar que todos os links redirecionam para o último post

### Para confirmar a correção:
1. Configurar `sharedPrerenderData: false`
2. Fazer build: `npm run build`
3. Testar em produção: `npx wrangler pages dev dist`
4. Verificar que cada link navega para seu respectivo post

## 📚 Lições Aprendidas

### 1. **Debugging Sistemático**
- A análise do HTML renderizado (`data-v-*` idênticos) foi crucial
- A hipótese sobre "loop sobrescrevendo estado" estava correta
- Testar configurações específicas do Nuxt foi fundamental

### 2. **Nuxt 4 Experimental Features**
- `sharedPrerenderData` pode causar conflitos em aplicações com múltiplos componentes dinâmicos
- Especialmente problemático quando há loops (`v-for`) com componentes que têm estado interno

### 3. **Problemas Específicos de Produção**
- Alguns bugs só aparecem em builds de produção devido a otimizações
- Sempre testar funcionalidades críticas em ambiente de produção simulado

## ⚠️ Considerações de Performance

**Impacto de `sharedPrerenderData: false`:**
- ✅ **Vantagem**: Isolamento de dados entre rotas (previne bugs de estado)
- ⚠️ **Desvantagem**: Possível aumento no tamanho dos bundles (dados duplicados)
- 💡 **Mitigação**: Para este projeto, o benefício de estabilidade supera o custo de performance

## 🔧 Configuração Final Recomendada

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  experimental: {
    sharedPrerenderData: false, // Essencial para evitar conflitos de estado
    renderJsonPayloads: true,   // Mantém otimização de payloads
    entryImportMap: true,       // Otimização de imports
    asyncContext: true,         // Context assíncrono
    lazyHydration: true,        // Hidratação lazy
  },
  // ...
})
```

## 📝 Notas de Desenvolvimento

- Este bug é específico para aplicações que usam componentes dinâmicos em loops
- Especialmente relevante para blogs/listings com múltiplos cards/links
- A configuração `sharedPrerenderData: false` deve ser considerada padrão para aplicações com componentes complexos

---

**Data:** 05/10/2024
**Versão do Nuxt:** 4.1.2
**Preset:** cloudflare-pages
**Status:** ✅ Resolvido
