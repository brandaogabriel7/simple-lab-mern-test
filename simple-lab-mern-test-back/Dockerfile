FROM node:23.11.0-slim

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

ENV PORT=8080
EXPOSE ${PORT}

CMD ["npm", "start"]