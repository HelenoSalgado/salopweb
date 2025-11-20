---
title: "Configurando Google Drive no Hyprland com Nautilus e Gnome Control Center"
description: "Parece ainda não existir uma maneira mais simples e menos custosa de obter o Google Drive no gerenciador de arquivos do Hyprland senão recorrendo ao bom e velho Gnome, sem erros"
date: '2025-11-20'
categories:
    - Linux
published: true
---

Para quem usa Hyprland com o objetivo de economizar recursos de máquina, não parece coerente ficar instalando componentes pesados (mas funcionais) do grupo Gnome. Eu tive que aceitar o sacrifício para obter as vantagens do **Google Drive** sincronizado localmente no meu gerenciador de arquivos. Para quem não conseguiu configurar o _Rclone_ corretamente ou acha chato ter que ficar usando terminal, a combinação a seguir pode ser mais eficiente. Você deve procurar os comandos correspondentes para a instalação em sua própria distro.

## Instalando todos os pacotes
```bash
sudo pacman -S nautilus gnome-control-center gvfs-google gvfs-goa gnome-keyring
```

## O que cada pacote faz?

**nautilus**: Gerenciador de arquivos popular e elegante, oficial no Gnome;

**gnome-control-center**: Central de controle do Gnome e a sua única utilidade, no nosso caso, é conectar o Google ao nosso sistema através da opção _Contas Online_.

**gvfs-google**: Integra serviços de nuvem do Google, como o Google Drive;

**gvfs-goa**: Integra o sistema de contas online do GNOME.

**gnome-keyring**: Sistema de gerenciamento de senhas e informações sensíveis para o ambiente de desktop GNOME e _outros aplicativos no Linux_;

_gvfs-google e gvfs-goa são partes do sistema de arquivos virtual GNOME Virtual File System (GVfs), que permite acessar serviços e redes como se fossem pastas locais_.

Enfim, embora nosso ambiente desktop não seja Gnome, a maioria dos aplicativos de interface do grupo Gnome são modulares e independentes, pois são aplicativos shell em javascript executados via engine SpiderMonkey do firefox, presente no runtime *GJS*.

## Finalizando Configuração

Você pode configurar um atalho no Hyprland para chamar o painel de controle e assim conectar a conta google, ou executar diretamente no terminal. Você precisa sempre passar a variável de ambiente correta para a runtime: `env XDG_CURRENT_DESKTOP=GNOME gnome-control-center`.


