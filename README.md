# Node.js API com Typescript
-----------
Código do curso 👉 [DO ZERO A PRODUÇÃO: APRENDA A CONSTRUIR UMA API NODE.JS COM TYPESCRIPT](https://www.nodejs-typescript-api.com/curso-gratis)

Durante o curso é criado uma API para calcular a melhor condição de surf entre varias praias, essa API tem como objetivo servir a aplicação [web]() (a aplicação web não
é construida durante o curso pois ela não é o foco do conteudo, ela é disponibilizada ja pronta).

A imagem abaixo mostra o resultado final do curso com a pagina web mostrando todos os dados que vem da API construida durante o curso.👌

![Exemplo pagina web](https://i.ibb.co/qp2jtLk/Screen-Shot-2020-07-18-at-10-42-39-am.png)

## Tecnologias utilizadas
----
Principais tecnologias utilizadas no código.

💻 [Node.js](https://nodejs.org/)

🧰 [Typescript](https://www.typescriptlang.org/)

✅ [Jest](https://jestjs.io/)

📦 [MongoDB](https://www.mongodb.com/)

🛠 [Github Actions](https://github.com/features/actions)


## Como o código é estraturado
-----

O código esta estrururado em branches para cada um dos capitulos. Para comparar as mudanças entre um capitulo e outro utilize a opção [Compare](https://github.com/waldemarnt/node-typescript-api/compare/step1...step2) do Github para ver
as mudanças lado a lada.

## Como rodar a pagina web
----
Para rodar a pagina web navegue para a [pasta /web](https://github.com/waldemarnt/node-typescript-api/tree/master/web) neste repositório e então altere o [arquivo de configuração](https://github.com/waldemarnt/node-typescript-api/blob/master/web/src/config.js) para apontar para
a sua API. Exemplo:

```
export const API_URL = 'http://localhost:3000';
```

Após isso instale as dependencias:

```
yarn install
```

E inicie a aplicação

```
yarn start
```

Uma nova aba no browser deve abrir. 
