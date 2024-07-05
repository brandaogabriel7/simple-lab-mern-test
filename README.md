# SimpleLab - Desafio técnico MERN

Esse projeto é parte de um processo seletivo pra SimpleLab. O projeto consiste em uma aplicação de cadastro de usuários desenvolvido com stack MERN.

## Implementação do servidor

O servidor é uma API desenvolvida com Node.js e Express. Essa API se comunica com o banco de dados para executar as operações com os usuários. Eu também adicionei o Jest para trabalhar com testes automatizados.

### Domínio

O domínio é simples e gira em torno do usuário. Então, meu primeiro passo foi criar uma entidade para implementar as regras de negócio do usuário.

1. Usuário possui 3 campos, todos obrigatórios: Nome, Email e Data de Nascimento
2. O email deve ter um formato válido (isso não tava nos requisitos mas eu decidi validar)
3. Impedir cadastro de usuários com email já existente no sistema
   - Por conta dessa regra, decidi usar o email como identificador da entidade Usuário. Por causa disso, email não vai ser um campo editável da entidade.
4. Permitir edição de usuários já cadastrados
   - Os campos de nome e data de nascimento podem ser editados. O email não pode porque vai ser usado como identificador.
5. Impedir cadastro de usuários com data de nascimento no futuro.

As outras regras de negócio tem mais relação com o banco de dados e o frontend, o que não é o foco nessa etapa. Com base nessas regras de negócio, eu criei a entidade `User` e o objeto de valor `BirthDate` (responsável por validar a data de nascimento).
