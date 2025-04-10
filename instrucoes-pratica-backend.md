# Prática - Dockerfile backend

Seu objetivo é criar um Dockerfile para o backend da aplicação. Você também deve completar o arquivo `docker-compose.yaml` para usar esse Dockerfile corretamente e subir a aplicação em conjunto com o banco de dados e o frontend.

## Dockerfile
Sua Dockerfile deve:
- Usar uma imagem base do Node.js versão 23.11
- Instalar as dependências do projeto
- Copiar o código fonte do projeto para dentro do container
- Expor a porta 8080
- Rodar o comando `npm start` para iniciar o servidor

## docker-compose.yaml
O arquivo `docker-compose.yaml` deve:
- Usar a imagem do Dockerfile que você criou para gerar a imagem do `backend`
- Colocar o backend na mesma rede que o banco de dados
- Definir o banco de dados como uma dependência do backend

## Dicas

Se você precisar, pode comparar seus arquivos com a branch `main`, onde tudo está funcionando. Mas não deixe de digitar as instruções por conta própria para treinar.

- Você pode usar o comando `docker compose up -d --build` para subir os containers em segundo plano e construir as imagens.
- Você pode usar o comando `docker compose logs backend` para ver os logs do backend.
- Você pode usar o comando `docker compose exec -it backend sh` para entrar no container do backend e rodar comandos dentro dele.
- Você pode usar o comando `docker compose down` para parar e remover os containers.
- Você pode usar o comando `docker compose ps` para ver os containers que estão rodando.

## Testando

O frontend e o banco de dados já estão corretamente configurados para subir. Você pode testar a aplicação funcionando subindo todos os serviços e acessando `http://localhost:3000` no seu navegador.

## Materiais úteis
- [Dockerfile common instructions](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/#common-instructions)
- [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
- [Documentação do Docker Compose](https://docs.docker.com/compose/)
- [Docker hub do Node.js](https://hub.docker.com/_/node)