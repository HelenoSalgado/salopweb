---
title: "theWord no Hyprland via Wine: Como Corrigir a Janela-Mãe e o Tiling"
description: "Resolvendo a sobreposição flutuante da janela-mãe do Delphi e forçar o ladrilhamento perfeito do software bíblico theWord no Hyprland."
date: '2026-11-05'
categories:
   - Linux
published: true
---

O **theWord** é um dos softwares de estudo bíblico mais completos do ecossistema Windows. Ao executá-lo no Arch Linux com Hyprland via Wine, a aplicação não entra no fluxo nativo de composição (*tiling*) e apresenta três comportamentos indesejados:

1. **Janela-mãe ao fundo:** Uma janela secundária com o título `theWord` é renderizada ao fundo, ocupando a metade lateral da tela.
2. **Sobreposição por foco em vez de composição:** A janela principal de leitura (cujo título varia conforme o texto, ex.: `2Jo 1:1 - theWord`) sobrepõe a janela-mãe em modo flutuante clássico (*floating z-order*), competindo por foco visual em vez de ser gerenciada pelo Hyprland.
3. **Área vertical incompleta:** A janela de leitura não preenche todo o espaço vertical da tela, iniciando com um deslocamento de 18 pixels no topo e deixando uma faixa visível do papel de parede.

## A Causa do Problema

O theWord é desenvolvido sobre a biblioteca **VCL (Delphi)**. No Windows, o Delphi cria uma janela oculta para o ciclo de mensagens do processo (`Application.Handle` / `TApplication`) e define a janela visual principal (`TMainForm`) como dependente (*transient*) dela.

Sob o **XWayland**, o Wine mapeia ambas como janelas X11 reais independentes:

* A janela-mãe (`theWord`) ganha uma superfície gráfica própria ocupando metade da tela ao fundo.
* A janela filha (`.* - theWord`) herda a dependência `WM_TRANSIENT_FOR` e restrições rígidas de geometria (`WM_NORMAL_HINTS` com `min_size` igual a `max_size` e altura reduzida para acomodar a antiga barra de tarefas do Windows).

Como consequência dessas regras de tamanho e do vínculo de diálogo, o Hyprland mantém ambas em modo flutuante (`floating = 1`), gerando duas janelas sobrepostas por foco em vez de um ladrilhamento nativo.

::Callout{type="attention"}
Mover a janela-mãe para um *workspace* especial (como `special:silent`) piora o cenário. Devido ao vínculo `WM_TRANSIENT_FOR`, o compositor trata o *scratchpad* como uma sobreposição ativa em todos os espaços, fazendo a janela-mãe aparecer fixa em todas as áreas de trabalho e bloquear os cliques nos demais programas.
::

## Solução no Hyprland

A abordagem correta não tenta esconder a janela-mãe em outro espaço, mas neutraliza sua presença física onde ela for criada:

1. **Neutralizar a janela-mãe:** Reduzir suas dimensões para `1x1` na coordenada `0 0`, removendo bordas, foco, sombras e desfoque. Ela segue viva para atender ao processo do Wine, mas sem área visual nem interferência de mouse.
2. **Forçar o ladrilhamento da janela principal:** Aplicar `tile = true` e `no_max_size = true` especificamente à janela que termina em `- theWord$`, entregando o controle de tamanho e posicionamento ao Hyprland.
3. **Preservar popups e balões de versículos:** Manter caixas de diálogo, a tela de abertura (*splash screen*) e tooltips de termos originais/Strong (`tips`, `tips2`) flutuantes e responsivos.

---

### Configuração em Lua (`hyprland.lua`)

Para quem utiliza a sintaxe moderna em Lua (Hyprland v0.57+):

```lua
-- XWayland: Garante nitidez máxima nas fontes bíblicas
hl.config({
    xwayland = {
        force_zero_scaling = true,
    },
})

-- 1. Neutraliza a janela-mãe do Delphi (TApplication)
hl.window_rule({
    name = "theword-mother",
    match = {
        class = "^(theword[.]exe)$",
        title = "^(theWord)$",
    },
    float            = true,
    size             = "1 1",
    move             = "0 0",
    no_focus         = true,
    no_initial_focus = true,
    border_size      = 0,
    no_shadow        = true,
    no_blur          = true,
})

-- 2. Tela de inicialização (Splash)
hl.window_rule({
    name = "theword-startup",
    match = {
        class = "^(theword[.]exe)$",
        title = "^(frmStartup)$",
    },
    float  = true,
    center = true,
})

-- 3. Janela principal de leitura (Ladrilhamento nativo)
hl.window_rule({
    name = "theword-main",
    match = {
        class = "^(theword[.]exe)$",
        title = ".* - theWord$",
    },
    tile        = true,
    no_max_size = true,
})

-- 4. Tooltips e balões rápidos de versículos e Strong (tips, tips2)
hl.window_rule({
    name = "theword-tips",
    match = {
        class = "^(theword[.]exe)$",
        title = "^(tips[0-9]*)$",
    },
    float     = true,
    no_focus  = true,
    no_shadow = true,
    no_blur   = true,
    no_anim   = true,
})
```

### Configuração Tradicional (`hyprland.conf`)

Para a sintaxe clássica do Hyprland:

```ini
# XWayland: Garante nitidez máxima nas fontes bíblicas
xwayland {
    force_zero_scaling = true
}

# 1. Neutraliza a janela-mãe do Delphi (TApplication)
windowrule = match:class ^(theword\.exe)$, match:title ^(theWord)$, float 1
windowrule = match:class ^(theword\.exe)$, match:title ^(theWord)$, size 1 1
windowrule = match:class ^(theword\.exe)$, match:title ^(theWord)$, move 0 0
windowrule = match:class ^(theword\.exe)$, match:title ^(theWord)$, no_focus 1
windowrule = match:class ^(theword\.exe)$, match:title ^(theWord)$, border_size 0
windowrule = match:class ^(theword\.exe)$, match:title ^(theWord)$, no_shadow 1
windowrule = match:class ^(theword\.exe)$, match:title ^(theWord)$, no_blur 1

# 2. Tela de inicialização (Splash)
windowrule = match:class ^(theword\.exe)$, match:title ^(frmStartup)$, float 1
windowrule = match:class ^(theword\.exe)$, match:title ^(frmStartup)$, center 1

# 3. Janela principal de leitura (Ladrilhamento nativo)
windowrule = match:class ^(theword\.exe)$, match:title .* - theWord$, tile 1
windowrule = match:class ^(theword\.exe)$, match:title .* - theWord$, no_max_size 1

# 4. Tooltips e balões rápidos de versículos e Strong
windowrule = match:class ^(theword\.exe)$, match:title ^(tips[0-9]*)$, float 1
windowrule = match:class ^(theword\.exe)$, match:title ^(tips[0-9]*)$, no_focus 1
windowrule = match:class ^(theword\.exe)$, match:title ^(tips[0-9]*)$, no_anim 1
```

![Captura de tela da janela theWord corrigida](./images/theword-no-hyprland-via-wine.png)

Com essa estrutura, o theWord se comporta como qualquer outro aplicativo do Arch Linux: expande-se e preenche 100% da tela quando estiver sozinho no espaço de trabalho ou divide o monitor lado a lado quando aberto junto ao terminal ou navegador.
