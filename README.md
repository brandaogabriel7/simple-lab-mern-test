# SimpleLab - Desafio técnico MERN

Esse projeto é parte de um processo seletivo pra SimpleLab. O projeto consiste em uma aplicação de cadastro de usuários desenvolvido com stack MERN.

## Implementação do servidor

O servidor é uma API desenvolvida com Node.js e Express. Essa API se comunica com o banco de dados para executar as operações com os usuários. Eu também adicionei o Jest para trabalhar com testes automatizados.

## Modelar domínio

O domínio é simples e gira em torno do usuário. Então, meu primeiro passo foi criar uma entidade para implementar as regras de negócio do usuário.

1. Usuário possui 3 campos, todos obrigatórios: Nome, Email e Data de Nascimento
2. O email deve ter um formato válido (isso não tava nos requisitos mas eu decidi validar)
3. Impedir cadastro de usuários com email já existente no sistema
   - Por conta dessa regra, decidi usar o email como identificador da entidade Usuário. Por causa disso, email não vai ser um campo editável da entidade.
4. Permitir edição de usuários já cadastrados
   - Os campos de nome e data de nascimento podem ser editados. O email não pode porque vai ser usado como identificador.
5. Impedir cadastro de usuários com data de nascimento no futuro.

As outras regras de negócio tem mais relação com o banco de dados e o frontend, o que não é o foco nessa etapa. Com base nessas regras de negócio, eu criei a entidade `User` e o objeto de valor `BirthDate` (responsável por validar a data de nascimento).

## Subir banco de dados e back-end com docker-compose

Depois de implementar as regras de negócio acima, meu foco foi criar um banco de dados de desenvolvimento pra rodar e conectar com o back-end. Pra facilitar todo o processo de subir o back-end, o front-end e o banco de dados, eu decidi usar `docker-compose`. Não é a forma como subiria a aplicação em produção mas é uma boa alternativa para desenvolvimento local.

> Eu usei o [Dockerize](https://github.com/jwilder/dockerize) pra garantir que o back-end só vai subir quando o db estiver disponível e evitar problemas na inicialização do container.

## Implementar conexão do banco de dados com o back-end

> Para me ajudar a testar os repositórios e simular o `mongodb` eu usei o [mongodb-memory-server](https://www.npmjs.com/package/mongodb-memory-server).

Os passos dessa etapa foram:

1. Mockar um mongodb pra testes do repositório.
2. Implementar o model `user` com o `mongoose`.
3. Implementar o repositório usando o model criado.

## Garantir que o email não seja repetido

Depois de implementar o repositório eu percebi que ficou faltando garantir uma regra de negócio no domínio: **o mesmo email não pode ser usado por mais de um usuário**

Então eu retornei para o domínio pra criar o `UserService`. Esse serviço que fica responsável por usar o repositório para fazer as operações no banco de dados e garantir a unicidade do email.

## Implementar api com express

Com o domínio e a comunicação com o banco de dados implementados. Só ficou faltando criar a api e disponibilizar as rotas para finalizar o back-end.

Nessa etapa eu decidi usar algumas bibliotecas a mais pra facilitar o desenvolvimento e a escrita de testes para a API.

- Usei o `supertest` pra facilitar nos testes automatizados da API
- Alterei o `docker-compose.yaml` pra rodar a api com o `nodemon`
  - É um ambiente de desenvolvimento, então eu queria que sempre que eu salvasse alterações aos arquivos a api atualizaria automaticamente

Por fim, eu implementei as rotas para cada uma das operações possíveis.

```
GET /api/users -> listar todos os usuários
GET /api/users/:email -> recuperar usuário por email
POST /api/users -> cadastrar novo usuário
PUT /api/users -> atualizar usuário existente
DELETE /api/users -> deletar usuário
```
