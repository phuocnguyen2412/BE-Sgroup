FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN apk add --no-cache zsh \
    && npm install

COPY ./src ./src
COPY ./app.js ./
COPY ./.env ./

CMD [ "npm", "start" ]
