---
title: "Corrigindo dependência não encontrada pelo makepkg"
description: "Aprenda a resolver problemas de dependência não encontrada ao usar o makepkg no Arch Linux, com dicas e soluções práticas."
date: '2025-09-22'
---

Recentemente tive que instalar o **Insominia** no Arch Linux, no entanto o build falhava por não encontrar o pacote nvm, que é uma dependência necessária para o tempo de execução.

Em suma, o método convencional não ajudou, então editei o aquivo **PKGBUILD** e comentei as linhas correspondentes ao erro, nas funções `prepare()` e `build()`. Pois eu estava absolutamente certo que a dependência estava na máquina, eu poderia, na pior das hipóteses, inserir o caminho completo do nvm nas linhas em que ele era chamado em **PKGBUILD**.

```bash
$ git clone https://aur.archlinux.org/insomnia.git

$ cd insominia

$ makepkg

$ makepkg --install
```

::callout{type="star"}
O nome do pacote final a ser instalado, depois do build, poderia também ser instalado com: `pacman -U nome-do-pacote.tar.zst`.
::

Tanto faz ser o Insomia como outro software, por vezes, no momento da construção, uma dependência pode não ser encontrada, apesar de estar devidamente instalada. Sendo assim, poderíamos abrir o arquivo **PKGBUILD** e observar a lista de dependências necessárias, certificar que estão instaladas e proseguir a construção ignorando as dependências com a flag `--nodeps`.

```bash
$ makepkg --nodeps
```

Isso deveria resolver o problema, no entanto, pode ocorrer falhas no restante do script que usam aquela dependência não encontrada, como na função `prepare()`.

Poderíamos passar esse erro, adicionando a flag `--noprepare`, que faz o makepkg ignorar a função `prepare()`. Mas o erro segue para a próxima função no **PKGBUILD**, a função `build()`:

E novamente poderíamos passar o erro usando outra flag `--nobuild`, isso resolveria o último erro, mas também, o pacote .**zst** final para instalação não seria gerado.

```bash
$ makepkg --nodeps --noprepare --nobuild
```

Em suma, o método convencional não nos ajudou, então podemos editar o aquivo **PKGBUILD** e comentar as linhas correspondentes ao erro, nas funções `prepare()` e `build()`. Assim podemos retirar as flags `--noprepare` e `--nobuild` que impedem a construção do pacote.

Já que resolveu por a mão na massa, você também pode retirar da lista de dependências o nvm, que é a única que o makepkg não consegue encontrar. Assim, não precisará mais da flag `--nodeps`.

E executando o comando novamente, o insomnia, ou outro pacote com problema do mesmo tipo, será compilado com sucesso.

```bash
$ makepkg

$ makepkg --install
```

Insomnia instalado com sucesso.
