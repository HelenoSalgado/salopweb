---
title: "Código à Prova do Tempo"
description: "Uma reflexão sobre estabilidade de código entre linguagens clássicas como C e o ecossistema moderno do JavaScript/NPM"
categories:
       - Programação
date: 2025-10-04
published: true
---

Há alguns anos, desenvolvi um servidor embrionário em C para estudar sockets, protocolos TCP/IP e regex. O projeto ficou parado por um tempo, mas recentemente, encorajado pela IA, resolvi refatorá-lo. Descobri que existe muito mais código entre o céu e a terra do que se pode imaginar — e muito mais beleza de código também!

As sugestões da IA foram incríveis. Quase me senti burro diante de tantas ideias e insights interessantes que surgiram durante a refatoração. Mas o que realmente me impressionou aconteceu quando executei o servidor: nenhum erro apareceu. Nem mesmo um aviso no terminal.

Eu realmente esperava alguma surpresa. Afinal, é quase impossível passar o mesmo tempo sem mexer num projeto Node/NPM e ele rodar de primeira. Se ainda não quebrou, vai quebrar com certeza — pode esperar sentado. E essa não é apenas uma impressão: estudos empíricos mostram que aproximadamente **13,9% das releases de pacotes clientes no npm são impactadas por breaking changes**[^1], com alterações incompatíveis sendo introduzidas erroneamente em versões minor e patch que deveriam ser seguras[^2].

Naquele momento, parei. Fiquei meio paralisado, com a mente em outro mundo — no país das maravilhas, talvez. Imaginei fazendo programas eternos em C, projetos que poderia criar e depois deitar para dormir sossegado, confiante de ter feito o melhor investimento, o trabalho mais consistente em código.

Ah, é tão bom quando o programa não quebra! E C não quebra — pelo menos não quebrou.

Pensando bem, se o interesse não é meramente ganhar dinheiro rápido, vale a pena investir em C ou qualquer outra linguagem menos "esmerilada". Perl, por exemplo, está há décadas resistindo ao tempo, como as próprias pirâmides do Egito.

Tem um meme na internet do senhor no púlpito da igreja repreendendo um irmão por esmerilar demais o hino e não cantar como deve ser, sem "esmerilar". O que quebra o projeto dos outros é exatamente esse esmerilamento. O programador fica olhando demais para o código, quer esmerilar, e depois quebra o projeto dos outros que dependiam dele.

Não sei não, mas se eu pudesse, não dependeria de nenhum pacote npm. O problema não é apenas teoria: pesquisas revelam que **54,9% das releases de provedores com breaking changes possuem mais commits que suas demais releases**[^1], indicando que quanto mais mexem no código, mais risco de quebrar tudo. É evidente que uma pessoa normal não perderia tempo com linguagem antiquada — pelo menos essa geração do imediatismo não está disposta. Mas acho que vale a pena se sacrificar um pouco mais em troca de qualidade e consistência de código.

---

[^1]: Venturini, D. (2020). *Estudo Empírico sobre Breaking Changes em Níveis Minor e Patch no NPM*. Universidade Tecnológica Federal do Paraná. Disponível em: http://riut.utfpr.edu.br/jspui/bitstream/1/26106/6/estudoempiricobreakingchanges.pdf

[^2]: *Frequência de Breaking Changes Causados Pela String de Versionamento nas Dependências em Projetos Hospedados no NPM*. (2025). Scribd. Disponível em: https://pt.scribd.com/document/746169380
