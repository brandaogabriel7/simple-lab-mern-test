# Prática - Dockerfile frontend

Seu objetivo é criar um Dockerfile para o frontend da aplicação. Você também deve completar o arquivo `docker-compose.yaml` para usar esse Dockerfile corretamente e subir a aplicação em conjunto com o banco de dados e o backend.

## Dockerfile
Sua Dockerfile deve:
- Usar uma imagem base do Node.js versão 23.11
- Instalar as dependências do projeto
- Copiar o código fonte do projeto para dentro do container
- Expor a porta 3000
- Rodar o comando `npm start` para iniciar o servidor

## docker-compose.yaml
O arquivo `docker-compose.yaml` deve:
- Usar a imagem do Dockerfile que você criou para gerar a imagem do `frontend`
- Passar as variáveis de ambiente `REACT_APP_API_URL` e `REACT_APP_USERS_PER_PAGE` para o frontend
- Configurar a porta 3000 do frontend para ser exposta na porta 3000 do host

## Dicas

Se você precisar, pode comparar seus arquivos com a branch `main`, onde tudo está funcionando. Mas não deixe de digitar as instruções por conta própria para treinar.

- Você pode usar o comando `docker compose up -d --build` para subir os containers em segundo plano e construir as imagens.
- Você pode usar o comando `docker compose logs frontend` para ver os logs do frontend.
- Você pode usar o comando `docker compose exec -it frontend sh` para entrar no container do frontend e rodar comandos dentro dele.
- Você pode usar o comando `docker compose down` para parar e remover os containers.
- Você pode usar o comando `docker compose ps` para ver os containers que estão rodando.

## Testando

O backend e o banco de dados já estão corretamente configurados para subir. Você pode testar a aplicação funcionando subindo todos os serviços e acessando `http://localhost:3000` no seu navegador.

Além disso, eu deixei alguns testes e2e prontos para você rodar. Depois de subir os serviços, basta executar os comandos:
```bash
# Navegar até a pasta do frontend
cd simple-lab-mern-test-front

# Rodar os testes
npm run cypress:run

# Ou para abrir a interface do Cypress
npm run cypress
```

## Materiais úteis
- [Dockerfile common instructions](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/#common-instructions)
- [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
- [Documentação do Docker Compose](https://docs.docker.com/compose/)
- [Docker hub do Node.js](https://hub.docker.com/_/node)