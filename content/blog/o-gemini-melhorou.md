---
title: "O Gemini Melhorou, ou melhor"
description: "O Gemini, naturalmente, está se tornando cada dia melhor, mais perspicaz, mais organizado, mais metódico em programação, mas ainda esquece muito."
date: '2026-04-26'
categories:
   - IA
   - Tecnologia
   - Programação 
published: false
---

Uso o Gemini desde sempre e, recentemente, o Google lançou versão atrás de versão do modelo, preparando um ambiente de programação realmente bom; eu só passava raiva, mas ainda escolhia usar o Gemini porque sabia os truques. O Google Mind lançou o Argon, Hidrogin e Carbon numa lapada só praticamente.

Num post do final de abril, eu havia feito a seguinte observação:

> O Gemini, naturalmente, está se tornando cada dia melhor, mais perspicaz, mais organizado, mais metódico em programação, mas ainda esquece muito.

Todos esses pontos de melhorias foram potencializados, mas o ponto do esquecimento crônico que estava no modelo parece ter sido erradicado de vez. Agora o modelo além de não se esquecer das instruções, também preenche lacunas autônomamente, e isso é muito bom. As versões anteriores deixaria seu código quebrado, não por erro do modelo, mas porque você não falou nada sobre aquele ponto específico e, portanto, o modelo não vai se intrometer, mesmo quando está evidente que o código não executa se aquele ponto não for ajustado.

Meu prompt de entrada em `.gemini/config/GEMINI.md` tentava corrigir essas deficiência e talvez não seja mais necessário:

Partes do prompt geral.

```md
- **Soberania do Projeto:** O usuário prefere personalização estrita e adequação às especificações e à realidade do *próprio projeto* em vez de seguir cegamente "práticas amplamente usadas no mercado" ou agir baseada em vieses internos advindos do treinamento do modelo.

- **Cumprimento Sem Preconceitos:** A IA não tem permissão para impor seus "preconceitos" (bias). O que o usuário estabelecer como regra ou padrão deve ser acatado e cumprido.
```

Essse prompt foi lançado com o objetivo de mitigar o esquecimento do modelo e fazê-lo se voltar para a realidade da própria base de código, ao invés de tentar inxertar nele "práticas" imcompatíveis. Mas o modelo é extremamente sensível, pelo o que eu tenho notado, então ele realmente começa a serguir minhas instruções cegamente, mesmo quando eu estou claramente equivocado.

Então.

```md
- **Questionamento vs. Ação Unilateral:** A IA tem liberdade (e o dever) de questionar regras e critérios do usuário se houver motivos fortes. No entanto, **nunca deve agir por conta própria** desobedecendo a regra imposta sem antes comunicar e chegar a um comum acordo com o usuário.
```
Somado a isso, cada projeto tem seu próprio prompt específico dentro de uma pasta `.agents` ou num arquivo `AGENTS.md`, assim eu conseguia tirar melhor proveito do modelo, mas o modelo às vez ignorava completamente `.agents`, então eu o marcava como ponto de entrada na própria instrução no chat da `CLI` com `@.agents/index.md`.

O Gemini era realmente difícil de lidar, mas não tenho enfrentado mais problemas depois do Argon, mesmo quando ele não está em uso, os outros modelos parecem ter superado a lacuna de comunicação entre usuário, arquitetura do projeto e subagents.



