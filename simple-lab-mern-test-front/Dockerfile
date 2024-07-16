FROM node:20.10.0

WORKDIR /app

COPY . .

RUN npm install

ENV PORT=3000
EXPOSE ${PORT}

CMD ["npm", "start"]