# UniFECAF Flix

API de consulta a um catálogo de filmes em MySQL. A mesma rota de filtro procura o termo em nomes e sinopses.

## Executar localmente

Pré-requisitos: Node.js 22.21.0 ou superior, npm e um servidor MySQL 8.0.19 ou superior. A demonstração foi validada no MySQL 8.4.13.

1. Importe o catálogo de demonstração em uma instância de desenvolvimento. O script cria o banco `unifecaf_flix` e carrega filmes fictícios para demonstrar a persistência.

   ```sh
   mysql -u root -p < database/catalogo_demonstracao.sql
   ```

2. Em uma conexão administrativa com o MySQL, crie um usuário de leitura. Use uma senha local própria.

   ```sql
   CREATE USER 'unifecaf_reader'@'127.0.0.1' IDENTIFIED BY 'SUBSTITUA_POR_SUA_SENHA';
   GRANT SELECT ON unifecaf_flix.filme TO 'unifecaf_reader'@'127.0.0.1';
   ```

   Ajuste o host do usuário conforme a origem da conexão vista pelo MySQL. Por exemplo, uma instância em contêiner pode receber a conexão pelo endereço da ponte Docker.

3. Copie o arquivo de exemplo, preencha `DB_PASSWORD` e ajuste os demais valores se necessário. Mantenha o arquivo `.env` apenas no ambiente local.

   ```sh
   cp .env.example .env
   npm ci
   npm start
   ```

4. Abra `http://127.0.0.1:3000/v1/controle-filmes/filme` em um navegador ou no Postman. A API confere o acesso à tabela e às colunas antes de abrir a porta HTTP.

## Contrato HTTP

Use a base `http://127.0.0.1:3000/v1/controle-filmes`.

| Método e caminho | Parâmetro | Resposta de sucesso |
| --- | --- | --- |
| `GET /filme` | Nenhum | `200` com `{"filmes":[...]}`, em ordem de ID |
| `GET /filme/:id` | ID inteiro positivo seguro em JavaScript, em decimal sem zeros à esquerda | `200` com `{"filme":{...}}` |
| `GET /filtro/filme?nome=xxx` | Termo único de 1 a 120 caracteres, após remover espaços nas pontas | `200` com `{"filmes":[...]}`, em ordem de ID |

Cada filme contém `id`, `nome` e `sinopse`. O filtro compara trechos de ambos os campos sem distinção de maiúsculas ou acentos. Envie o termo pela aba **Params** do Postman para que o cliente codifique os caracteres na URL. Consultas sem correspondência retornam uma lista vazia.

| Status | Situação |
| --- | --- |
| `400 Bad Request` | ID ou termo inválido |
| `404 Not Found` | Filme inexistente ou rota desconhecida |
| `500 Internal Server Error` | Falha ao executar uma consulta |

Os erros têm o formato `{"erro":{"codigo":"ID_INVALIDO","mensagem":"..."}}`.

## Organização do código

- `src/routes/filmes.js` associa métodos e caminhos aos controladores.
- `src/controllers/filmes.js` valida os parâmetros, chama o modelo e escolhe a resposta.
- `src/models/filmes.js` consulta o MySQL e usa parâmetros vinculados para ID e termos.
- `src/views/filmes.js` apresenta os dados e os erros em JSON.
- `src/config/database.js` configura o pool de conexões usando variáveis de ambiente.
- `src/app.js` monta o aplicativo Express e trata erros de forma centralizada.
- `src/server.js` verifica o esquema e inicia o servidor local.

O MySQL2 vincula os parâmetros da consulta separadamente do SQL. A busca usa curingas definidos pela aplicação, com tratamento literal dos caracteres `%`, `_` e `!` no termo. A conta de leitura precisa de `SELECT` na tabela de filmes.

## Testes no Postman

Importe `postman/UniFECAF Flix.postman_collection.json` e execute a coleção
na ordem original com a API e o MySQL ativos. A variável `baseUrl` permite
ajustar a porta. A listagem alimenta as variáveis dos testes seguintes. A
coleção verifica as três rotas, o filtro por nome e por sinopse, entradas
inválidas e consultas válidas sem correspondência.

Para executar a coleção localmente com o Postman CLI:

```sh
postman collection run "postman/UniFECAF Flix.postman_collection.json" --no-report-events
```
