---
title: "O Google ainda não sabe"
description: "A decisão foi tomada, é melhor ter a aprovação humana do que a aprovação do robôzinho do Google."
---

# A Batalha pela Performance: Por que Abandonei os 100 Pontos do Google

Há cerca de três anos, desenvolvi um site com Nuxt.js. Minha intenção era obter o tão desejado desempenho prometido pelo seu modo de renderização híbrida, uma tecnologia conhecida como **Hidratação**. A premissa é fantástica: o Nuxt é capaz de gerar um site totalmente estático e, ao mesmo tempo, reaproveitar todos os componentes já baixados no navegador do usuário. Com isso, a cada nova página acessada, o servidor retorna apenas o conteúdo em si. A economia de rede e processamento é extraordinária.

Tudo estava pronto. Eu tinha o melhor dos dois mundos: conteúdo dinâmico servido num site estático.

## O Pesadelo do SEO e a Tartaruga Colossal

O problema surgiu quando resolvi passar o pente fino e otimizar meu site para **SEO (Search Engine Optimization)**. Mas nos testes do Google, utilizando ferramentas como o **PageSpeed Insights** e o **Lighthouse**, meu site era simplesmente o pior do mundo. Ninguém iria acessar um site tão lento; era uma tartaruga colossal.

::Image
---
src: "/images/Gemini_Generated_Image_yk4akkyk4akkyk4a.png"
alt: "Tartaruga Colossal com elementos de tecnologia ao entorno"
---
::Image

A primeira "pintura" da tela era demorada. Isso porque, para que o **DOM (Document Object Model)** fosse renderizado, o navegador precisava baixar dezenas de arquivos JavaScript e CSS individualmente — um para cada componente: cabeçalho, menu, posts, rodapé, etc. Só a partir daí ele poderia reagrupar tudo e começar o processo de exibição. O processamento inicial era enorme e o número de requisições ao servidor, fora do comum. Era um fato: a carga inicial era grande demais para passar nos testes de desempenho do Google. Tive que repensar a estratégia. Eu precisava da aprovação do Google; afinal, era ele quem iria recomendar meu site às pessoas.

## A Decisão Drástica: Um Site "Burro" e Orgulhoso

O trabalho agora era otimizar para o Google, mas o site continuava pesado. A análise era clara: o Google aceita pouco mais de três ou quatro arquivos de JavaScript e CSS, e eu tinha dezenas deles no topo do HTML. Para cada componente, um link. Pior ainda, a quantidade de JavaScript "crítico" e não utilizado na primeira carga era realmente grande.

Ficou evidente que o Google não se importava se aquele JavaScript, inútil num primeiro momento, seria fundamental para otimizar todas as interações subsequentes do usuário. Ainda que a primeira carga fosse pesada, as seguintes seriam incrivelmente leves, trazendo apenas conteúdo dinâmico e informativo.

O problema estava claro, e eu tomei uma decisão drástica: **removi qualquer tipo de hidratação. Meu site agora era absolutamente estático.**

Pode parecer contraditório, mas não é. A tecnologia de hidratação, presente no Nuxt e em outros frameworks como **React (com Next.js) ou Svelte (com SvelteKit)**, é inteligente o suficiente para gerar um site estático ao mesmo tempo em que isola componentes para reaproveitamento. É exatamente essa parte *inteligente*, com seu JavaScript "crítico", que o **Lighthouse** não deixa passar impune. O Google realmente assume que, a cada clique, tudo será baixado novamente, quando na verdade isso só acontece uma vez. O resto é mágica da hidratação.

Quando disse que tornei meu site "absolutamente estático", quis dizer que removi todo o sistema de inteligência do framework. E agora eu tinha um site *burro*, que precisava baixar o documento HTML inteiro a cada nova interação. Obviamente, o gasto de recursos era maior, mas o primeiro acesso era entregue quase que instantaneamente. Eu obtive a façanha dos **100 pontos no Google** no teste de desempenho; tudo estava verde, nenhum código crítico ou não usado, pois a página vinha perfeitamente pronta do servidor.

## A Redescoberta: Trocando o Robô pelo Humano

E agora? Eu estava satisfeito, tinha a aprovação do Google. Só recentemente, ao desenvolver este blog, me deparei com o mesmo dilema. Mas, desta vez, eu resolvi agradar o usuário, e não mais o mecanismo de busca. Há tantos benefícios que se perdem com um site absolutamente estático, que preferi a abordagem híbrida do Nuxt novamente. Benefícios como:

- Navegação instantânea, sem o "piscar" de uma página recarregando;
- A possibilidade de usar transições de página animadas e elegantes;
- Menor consumo de dados para o usuário em sessões de navegação mais longas;
- A sensação de estar usando um aplicativo rápido e moderno, não um site tradicional.

Se o robôzinho do Google se preocupasse com a navegação interna nesses testes de desempenho, ele mesmo, apesar de não ter coração, iria se comover e rever suas métricas e requisitos para a aprovação de um site híbrido.

> Quando uma medida se torna uma meta, ela deixa de ser uma boa medida (Charles Goodhart).