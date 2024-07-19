# SimpleLab - Desafio técnico MERN

Esse projeto é parte de um processo seletivo pra SimpleLab. O projeto consiste em uma aplicação de cadastro de usuários desenvolvido com stack MERN.

## Stack

Como mencionado acima, esse projeto foi desenvolvido com a stack `MERN`(MongoDB, Express.js, React.js e Node.js). Além disso, eu usei Docker e Docker compose pra facilitar a execução da aplicação.

### Ferramentas e libs usadas

Eu usei o mínimo possível de bibliotecas e ferramentas além das recomendadas nas instruções do processo seletivo (`react-router-dom`, `react-redux`, `bootstrap`, `mongoose` e `Faker.js`) mas decidi utilizar outras pra facilitar algumas partes.

Pra ajudar com os testes automatizados eu usei as seguintes ferramentas e libs:

- `mongodb-memory-server`: rodar um mongodb em memória pra testes de integração
- `supertest`: facilitar o teste de integração da api
- `cypress`: fazer os testes ponta a ponta do front

Usei as bibliotecas `winston` e `morgan` pra implementar os logs da api.

E usei também as bibliotecas `react-router-bootstrap` e `react-bootstrap` para facilitar a integração do `React` com o `Bootstrap`.

## Instruções para execução do projeto

### Docker compose

A forma mais simples e que eu recomendo para rodar toda a aplicação é com Docker compose. Eu deixei um arquivo [docker-compose.yaml](docker-compose.yaml) que sobe toda a aplicação em ambiente de desenvolvimento, o front, o back e uma instância de `mongodb`. Além disso, o script [setupTestData.js](./simple-lab-mern-test-back/setupTestData.js) é executado para cadastrar 1000 usuários de teste.

```bash
# na pasta raiz do repositório
docker compose up -d
# dependendo da versão do Docker e do Docker compose o comando pode ser outro:
docker-compose up -d
```

### Sem Docker

Pra executar a aplicação sem Docker você pode rodar `npm install` e `npm start` nas pastas do front e do back. No entanto, você precisa passar variáveis de ambiente com configurações necessárias pra execução de cada um. Você pode fazer isso criando arquivos `.env` nas pastas [simple-lab-mern-test-back](./simple-lab-mern-test-back/) e [simple-lab-mern-test-front](./simple-lab-mern-test-front/).

No arquivo `.env` do back-end, passe a variável `MONGO_CONNECTION_STRING` com a connection string para o `mongodb`, incluindo o nome da base de dados. Por exemplo: `mongodb://localhost:27017/simple-lab-mern-test`.

Já no front-end, você precisa passar a variável `REACT_APP_API_URL`, contendo a url para a API. Por exemplo: `http://localhost:8080`.

## Endpoints da API

Aqui está a descrição dos endpoints da API. Também deixei uma [Postman collection](./simple-lab-mern-test-back/postman/SimpleLab%20MERN%20Test.postman_collection.json) pronta pra facilitar os testes.

### Criar usuário

`POST /api/users` -> Cadastra um novo usuário.

Exemplo de requisição:

```
POST http://localhost:8080/api/users
{
   "email": "Abdullah_Willms75@gmail.com",
   "name": "Abdullah Williams",
   "birthDate": "1999-07-23"
}
```

Resposta:
`Status 200`

### Listar usuários

`GET /api/users` -> Esse endpoint lista os usuários cadastrados no banco de dados. Ele também pode receber parâmetros da query da requisição para paginação (`page` e `pageSize`) e filtro (`name`, `email`, `birthDateAfter` e `birthDateBefore`).

Exemplo de requisição:
`GET http://localhost:8080/api/users?page=1&pageSize=3&name=a&email=la&birthDateAfter=2024-01-18&birthDateBefore=2024-07-19`

Resposta:

```
Status: 200
{
    "data": [
        {
            "email": "Abdullah_Willms75@gmail.com",
            "name": "Jodi Daugherty",
            "birthDate": "2024-07-15"
        },
        {
            "email": "Ahmed.Nikolaus4@yahoo.com",
            "name": "Sherri Balistreri III",
            "birthDate": "2024-01-29"
        },
        {
            "email": "Alanna.Wolf@hotmail.com",
            "name": "Mr. Juan Kunde",
            "birthDate": "2024-07-09"
        }
    ],
    "page": 1,
    "pageSize": 3,
    "totalPages": 23,
    "filter": {
        "name": "a",
        "email": "la",
        "birthDate": {
            "before": "2024-07-19",
            "after": "2024-01-18"
        }
    }
}
```

### Recuperar usuário por email

`GET /api/users/:email` -> Encontra o usuário com o email fornecido, se existente.

Exemplo de requisição:
`GET http://localhost:8080/api/users/Abdullah_Willms75@gmail.com`

Resposta:

```
Status: 200
{
    "data": {
        "email": "Abdullah_Willms75@gmail.com",
        "name": "Jodi Daugherty",
        "birthDate": "2024-07-15"
    }
}
```

### Atualizar usuário

`PUT /api/users` -> Atualiza os campos do usuário fornecido no corpo da resposta, se existente.

Exemplo de requisição:

```
PUT http://localhost:8080/api/users
{
   "email": "Abdullah_Willms75@gmail.com",
   "name": "New Name",
   "birthDate": "2000-07-15"
}
```

Resposta:
`Status 200`

### Deletar usuário

`DELETE /api/users/:email` -> Deleta o usuário com o email especificado.

Exemplo de requisição:
`DELETE http://localhost:8080/api/users/Abdullah_Willms75@gmail.com`

Resposta:
`Status: 200`
