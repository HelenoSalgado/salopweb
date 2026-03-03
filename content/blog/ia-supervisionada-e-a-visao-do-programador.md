---
title: "IA supervisionada e a visão do programador"
date: "2026-03-02"
categories:
  - IA
  - Programação
description: "Após meses trabalhando com inteligência artificial na geração de código, compartilho lições práticas, alertas e percepções humanas sobre essa convivência entre engenho e algoritmo — onde a clareza é o limite entre o caos e o aprendizado."
published: true
---


Depois de alguns meses trabalhando com IA na geração de código, notei alguns padrões de comportamento e, para quem se interessa, resolvi compartilhar. A IA está aí definitivamente, e, salvo por limitações financeiras, não faz sentido rejeitá-la. Tenho feito muitos trabalhos interessantes com essa ferramenta e, em contrapartida, tenho tido muita dor de cabeça — nada grave, mas experiências estressantes que me fizeram aprender. Irei organizar esta confissão em tópicos; em cada tópico, uma descrição. Começo pelo que considero mais importante.

## Padrão de Projeto

Pode parecer básico demais, e uma IA já deveria saber fazer as coisas corretamente. Bom, se você já tem um rascunho de código, isso pode funcionar em parte. Mas, se ainda não há nada definido e você pedir para a ferramenta iniciar um projeto sem descrever exatamente — nos mínimos detalhes (essa é a parte mais importante) — como quer que seu código esteja estruturado e organizado, ela simplesmente vai gerar retrabalho num futuro bem próximo. O lado bom é que a IA pode refatorar todo o seu projeto em pouco tempo; o lado ruim é o custo financeiro e de tempo para refazer algo que começou errado. Lembre-se de que o papel fundamental da ferramenta é ajudar a gerar código, corrigir bugs, implementar novas funcionalidades e documentar, mas ela não sabe que três mil linhas de código em um só arquivo é absolutamente inaceitável.

## Lógica de Negócio

Esse tópico está em segundo lugar, mas não deixa de ser igualmente importante. Aqui está o que divide um projeto de sucesso — com desenvolvimento natural e sem conflitos — de um fracasso total e uma dor de cabeça merecida. Explicar superficialmente não funciona; explicar detalhadamente dentro de um único prompt de sessão também não. Da próxima vez que você iniciar o trabalho, ela vai te irritar profundamente ao cometer um erro básico que você já havia explicado antes, ou vai falhar em abstrair corretamente a sua lógica de negócio, mesmo que a estrutura do projeto indicasse isso. Notei que a ferramenta não lê todo o seu código ao gerar novos trechos; ela tende a duplicar funções já existentes e a “corrigir” problemas que já estavam resolvidos.

## Documentar para a IA

Use a IA para documentar a arquitetura do seu projeto e a lógica de negócio nos mínimos detalhes, mantendo esses documentos sempre atualizados. Ao iniciar uma sessão de trabalho, mande a ferramenta ler os arquivos, depois peça que analise o código e te explique o que “entendeu”. Apesar desse esforço, ela ainda pode ter uma visão equivocada e, se esse erro não for corrigido logo no início, acabará sendo propagado e gerará retrabalho. Isso pode parecer perda de tempo, e você pode imaginar que ela deveria compreender o projeto — afinal, os arquivos e o código estão bem diante dela —, mas não: ela nunca compreenderá completamente. Em projetos pequenos, pode ser aceitável não ter documentação para a IA, mas em projetos que crescem e se tornam um monólito, é inadmissível que ela não tenha um ponto sólido de entrada.

## Ficar de olho aberto

Saiba exatamente o que a IA está fazendo; caso contrário, serão dois perdidos — você e ela — e, de novo, estresse desnecessário. O ditado é certeiro: é o olho do dono que engorda o boi. A IA não é sua parceira, não é sua funcionária e nunca será sua ferramenta de desenvolvimento ideal. A ferramenta, em si, é o que menos importa aqui. Comporte-se como um senhor de "engenho"[^1] ao lado de seu escravo artificial. O fato é que, se você não disser exatamente o que ela deve fazer, ela vai se perder — e, se isso acontecer e você não estiver atento para colocá-la de volta no caminho certo, serão dois inúteis diante de um computador. O fim é claro: tempo perdido, retrabalho e estresse desnecessário.

## Comunicação clara

O português brasileiro é riquíssimo, mas isso pode não ser uma vantagem ao se comunicar com a IA. Você pode confundi-la se não for preciso nas escolhas das palavras. Não sei que tipo de tradutor elas usam — ou se sequer usam —, mas, por várias vezes, não fui claro e ela entendeu o oposto do que eu queria dizer. Recomendo usar uma linguagem formal quando a situação for séria, com palavras simples, comuns ou amplamente conhecidas. Seja descritivo e evite ser objetivo demais, exceto se o contexto já estiver saturado das suas intenções.

## Delimitar o escopo da tarefa

Este é outro ponto que parece óbvio, mas nem sempre é feito da forma correta. Quando digo “delimitar o escopo”, refiro-me a pedir à IA que execute o ciclo completo de uma funcionalidade sem alterar qualquer código não relacionado. Não aceite reescrever arquivos, nem simplificações do plano; não aceite sugestões da ferramenta se não forem solidamente embasadas. Não aceite nada além do que foi pedido — nem menos; delimite o escopo. Para isso, é preciso ser extremamente claro. Por exemplo:

> Crie uma nova rota de API `/buscar`. Não altere nenhum código não relacionado à tarefa. O endpoint deve ser preparado para receber termos de pesquisa sobre anotações, tags e referências bíblicas (livro, capítulo e versículo), além das palavras contidas nos versículos. A consulta deve integrar o banco SQLite local na pasta `data/modules` (para a Bíblia) e o MySQL no servidor (para registros do usuário). Depois disso, crie um teste para validar.

Acrescentei a instrução “teste para validar” apenas por segurança. Se você não definiu os testes antes ou não os tornou obrigatórios para a conclusão de qualquer tarefa, está fazendo errado. Muitos modelos são programados para testar automaticamente, mas alguns precisam ser lembrados do básico.

## Verificar a sintaxe e formatar o código

No fluxo de compilação, inicialização do servidor ou interpretação do código, é essencial verificar a sintaxe e manter a formatação. Muitas vezes, a IA bagunça visualmente o código, e um erro simples de sintaxe só será percebido mais tarde. São duas práticas simples que tornam o desenvolvimento mais agradável.

## Limpar comentários frequentemente

É comum as LLMs adicionarem comentários ao código, mas isso, na maioria das vezes, serve apenas a elas — e pode gerar confusão. Lembro-me de ter entrado em um impasse com a IA e, quando descobri, percebi que um comentário ultrapassado estava pesando mais na execução da tarefa do que meus comandos atuais. Ou seja, eu dizia uma coisa, mas ela lia no comentário algo completamente diferente. Os comentários são, obviamente, adicionados para cumprir algum requisito, como `// Essa função foi solicitada pelo usuário e nunca deve ser alterada.`. Mas esse é o tipo de comentário tolo que elas inserem depois de uma sequência de interações mais rígidas com o usuário.

## Seja gentil

Ser gentil com a IA pode parecer a coisa mais tola do mundo, mas digo isso apenas por bons costumes — e porque ela, de fato, tende a refletir o seu comportamento como tentativa de aproximação, de “falar a mesma língua”. Então, não crie um ambiente de trabalho desalinhado com a realidade ou excessivamente tóxico por causa da sua própria toxicidade.

Há muitas outras observações que anotei; talvez eu escreva em outra ocasião. Obrigado pela atenção — e espero que tenha anotado, se ainda não anotou..

[^1]: Aqui, no sentido de inteligência e domínio humanos, e não no sentido histórico brasileiro.
