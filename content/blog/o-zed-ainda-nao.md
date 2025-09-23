---
title: "Configuração Minimalista para VSCode/VSCodium e adiando o Zed"
description: "No final das contas o zed ainda não está pronto, apesar de ser um editor leve e elegante, ele ainda não está pronto - Vou persistir minha configuração minimalista para o VSCode aqui."
date: '2025-09-22'
categories:
    - programação
---

Recentemente, comecei a usar o editor Zed, que é minimalista por natureza e, além disso, bonito e eficiente. Porém, ao abrir um projeto Vue nesse editor, ele começou a apresentar problemas: me sugeriu uma extensão para Vue que não era capaz de suportar. Naturalmente, esperava-se que as extensões recomendadas fossem mais otimizadas e eficientes, mas, nesse caso, não foi assim.

É uma pena, porque o problema surgiu justamente com o framework com o qual mais trabalho. Talvez seja pela limitação do meu hardware antigo, com poucos recursos, ou, como acredito, por uma má otimização do próprio editor no gerenciamento de extensões. O fato é que, hoje, é praticamente impossível abrir um projeto sem que o consumo de CPU dispare para mais de 200%.

Então a decisão é clara: ou uso o Zed sem extensões, ou uso o VSCode, que é infinitamente mais otimizado nesse aspecto. Por enquanto, vou deixar aqui minha configuração minimalista para o VSCode/VSCodium e espero, em breve, poder voltar a usar o Zed com tranquilidade. Até lá...

```json
{
    // Salvamento e arquivos
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000,
    "files.trimTrailingWhitespace": true,
    "files.insertFinalNewline": true,
    "files.exclude": {
        "**/.git": true,
        "**/node_modules": true,
        "**/.next": true,
        "**/.output": true,
        "**/.cache": true,
        "**/dist": true,
        "**/.idea": true,
        "**/.vscode": false
    },
    // Interface e tema
    "workbench.colorTheme": "Sweet Dracula",
    "workbench.iconTheme": "vs-seti",
    "workbench.view.alwaysShowHeaderActions": false,
    "workbench.activityBar.location": "hidden",
    "workbench.sideBar.location": "right",
    "workbench.statusBar.visible": true,
    "workbench.startupEditor": "none",
    // Editor
    "editor.fontFamily": "JetBrainsMonoNL Nerd Font Mono",
    "editor.fontSize": 16,
    "editor.lineHeight": 1.5,
    "editor.smoothScrolling": true,
    "editor.minimap.enabled": false,
    "editor.wordWrap": "on",
    "editor.wordBreak": "keepAll",
    "editor.cursorBlinking": "solid",
    "editor.renderWhitespace": "boundary",
    "editor.renderControlCharacters": false,
    "editor.quickSuggestionsDelay": 400,
    "editor.suggestSelection": "recentlyUsed",
    "editor.glyphMargin": false,
    "editor.matchBrackets": "always",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.organizeImports": "always"
    },
    // Performance
    "search.followSymlinks": false,
    "search.exclude": {
        "**/node_modules": true,
        "**/dist": true,
        "**/.git": true,
        "**/.next": true,
        "**/.cache": true
    },
    "files.watcherExclude": {
        "**/node_modules/*/**": true,
        "**/.git/objects/**": true,
        "**/dist/**": true,
        "**/.cache/**": true
    },
    // AI e Chat
    "chat.agent.enabled": false,
    "chat.disableAIFeatures": true,
    // Diversos
    "explorer.confirmDragAndDrop": false,
    "explorer.confirmDelete": false,
    "editor.gotoLocation.multipleDefinitions": "goto"
}
```
