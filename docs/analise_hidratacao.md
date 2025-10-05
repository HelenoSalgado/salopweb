# Análise de Erro de Hidratação

Durante o desenvolvimento, foi identificado um erro de hidratação no Nuxt. A seguir, uma análise das diferenças encontradas entre o HTML renderizado pelo servidor (SSR) e o HTML renderizado pelo cliente que provavelmente causaram o problema.

## Diferenças Principais (Causas Prováveis do Erro)

1.  **Atributos Divergentes no Link do Post Relacionado:**
    *   **HTML do Servidor:** O link para o post atual na seção de posts relacionados possuía as classes `router-link-active` e `router-link-exact-active`, além do atributo `aria-current="page"`.
        ```html
        <a aria-current="page" href="/blog/chame-os-do-que-voce-e" class="router-link-active router-link-exact-active button" data-v-3a20a27a> Leia Mais » </a>
        ```
    *   **HTML do Cliente:** No cliente, esses atributos e classes não existiam no mesmo link, indicando que o roteador do Vue não identificou o link como ativo durante a hidratação.
        ```html
        <a data-v-3a20a27a="" href="/blog/chame-os-do-que-voce-e" class="button"> Leia Mais » </a>
        ```

2.  **URL Inválida nos Botões de Compartilhamento:**
    *   Tanto no servidor quanto no cliente, a URL nos links de compartilhamento de redes sociais terminava com `undefined`. Isso indica que a variável que deveria conter o caminho da página (provavelmente `route.path`) não estava sendo lida corretamente quando a URL de compartilhamento era montada.
    *   **Exemplo (Twitter):**
        ```html
        <a href="https://twitter.com/intent/tweet?text=...&url=https%3A%2F%2Fheleno.devundefined" ...>
        ```

## Diferenças Secundárias

Inconsistências que também representam uma dessincronização entre servidor e cliente:

*   **Atributo `<html>`:** O servidor renderiza `<html lang="pt-BR">`, enquanto o cliente o altera para `<html class="dark">`.
*   **Atributos `crossorigin`:** Nos links `modulepreload` no `<head>`, o servidor renderiza o atributo `crossorigin` sem valor, enquanto o cliente o renderiza como `crossorigin=""`.
*   **Atributos `data-v-*`:** Muitos componentes no cliente são renderizados com o atributo de escopo de estilo vazio (ex: `data-v-7a114b0e=""`), enquanto no servidor eles não têm o `=""`.

## Resumo do Problema

O erro de hidratação ocorreu porque o DOM gerado no servidor não correspondia ao que o JavaScript (Vue/Nuxt) gerava no cliente. A causa mais provável foi a **diferença nos atributos do link ativo** e o **erro na geração da URL de compartilhamento**, apontando para problemas no acesso aos dados da rota atual durante os diferentes ciclos de renderização (servidor vs. cliente).
