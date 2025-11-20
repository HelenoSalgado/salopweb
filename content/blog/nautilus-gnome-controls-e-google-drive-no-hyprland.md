---
title: "Configurando o Google Drive no Hyprland com Nautilus e GNOME Control Center"
description: "Aparentemente, a maneira mais simples e eficiente de integrar o Google Drive ao gerenciador de arquivos no Hyprland é utilizando componentes do GNOME."
date: '2025-11-20'
categories:
    - Linux
published: true
---

Para quem utiliza Hyprland visando a economia de recursos, a instalação de componentes do GNOME pode parecer contraditória. No entanto, é um sacrifício necessário para obter as vantagens do **Google Drive** sincronizado localmente no seu gerenciador de arquivos. Para aqueles que tiveram dificuldades com a configuração do _Rclone_ ou preferem evitar o uso do terminal, a alternativa a seguir pode ser mais eficaz. Você deve procurar os comandos correspondentes para a instalação em sua própria distro.

## Instalando todos os pacotes
```bash
sudo pacman -S nautilus gnome-control-center gvfs-google gvfs-goa gnome-keyring
```

## O que cada pacote faz?

**nautilus**: Gerenciador de arquivos popular e elegante, oficial do GNOME;

**gnome-control-center**: A Central de Controle do GNOME, cuja única utilidade, no nosso caso, é conectar o Google ao sistema através da opção _Contas Online_.

**gvfs-google**: Integra serviços de nuvem do Google, como o Google Drive;

**gvfs-goa**: Integra o sistema de contas online do GNOME.

**gnome-keyring**: Sistema de gerenciamento de senhas e informações sensíveis para o ambiente de desktop GNOME e outros aplicativos no Linux;

Tanto o `gvfs-google` quanto o `gvfs-goa` são componentes do GNOME Virtual File System (GVfs), um sistema de arquivos virtual que permite o acesso a serviços e redes como se fossem pastas locais.

Embora nosso ambiente de desktop não seja o GNOME, a maioria dos aplicativos de interface do grupo GNOME são modulares e independentes. Eles são, na verdade, aplicativos shell em JavaScript executados pela engine SpiderMonkey (a mesma do Firefox), presente no runtime *GJS*.

## Finalizando a Configuração

Você pode configurar um atalho no Hyprland para abrir o painel de controle e conectar sua conta Google, ou pode executá-lo diretamente no terminal. É crucial sempre passar a variável de ambiente correta para o runtime: `env XDG_CURRENT_DESKTOP=GNOME gnome-control-center`.