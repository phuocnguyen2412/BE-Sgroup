FROM node:18

WORKDIR /app

COPY package.json ./

RUN  npm install

COPY ./src ./src
COPY ./app.js ./


CMD [ "npm", "start" ]
