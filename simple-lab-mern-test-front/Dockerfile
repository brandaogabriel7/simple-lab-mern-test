FROM node:21.6.2

WORKDIR /app

COPY . .

RUN npm install

ENV PORT=3000
EXPOSE ${PORT}

CMD ["npm", "start"]