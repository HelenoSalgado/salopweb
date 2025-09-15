---
title: "Loop infinito do IWD - Conflito"
description: "Entenda o conflito do IWD com outros gerenciadores de rede e como resolver o loop infinito de conexão."
image: "/images/default-post.png"
---

O [iwd](https://iwd.wiki.kernel.org/) (iNet wireless daemon), daemon sem fio para Linux escrito pela Intel, apesar de ser autônomo e compatível com outros gerenciadores de rede mais abrangentes, como o `systemd-networkd`, pode justamente entrar em conflito com ele, ou eles.

O iwd entra em loop infinito ao perder o sinal de rede wireless, sem nunca conseguir se reconectar, e usa processamento acima da média. A solução é desabilitar outros gerenciadores de rede e esperar, até chegar ao pacote conflitante.

Exemplo:

```bash
$ systemctl stop systemd-networkd
```
```bash
$ systemctl disable systemd-networkd
```

E esperar para ver se resolve, caso contrário, desabilite o próximo gerenciador de rede, talvez o NetworkManager. Se sua única conexão for via wireless, não terá problemas se o único daemon que sobrar for o iwd, caso precise se conectar via cabo, pode habilitar o gerenciador relacionado e desabilitar o iwd.

```bash
$ systemctl enable systemd-networkd
```
```bash
$ systemctl start systemd-networkd
```
```bash
$ systemctl stop iwd
```
```bash
$ systemctl disable iwd
```

**Fonte**: [Wiki do Arch Linux](https://wiki.archlinux.org/title/Iwd_(Portugu%C3%AAs)#:~:text=Wifi%20fica%20desconectando,tempo%20por%20voc%C3%AA)