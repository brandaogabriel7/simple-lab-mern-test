FROM node:23.11.0-slim

WORKDIR /app

COPY . .

RUN npm installs

ENV PORT=3000
EXPOSE ${PORT}