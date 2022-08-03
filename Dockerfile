FROM node:17-alpine
ARG CONFIG=main
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./
COPY yarn.lock ./

USER node

RUN yarn --frozen-lockfile

COPY --chown=node:node . .
RUN cp servers/index-${CONFIG}.js index.js
EXPOSE 8081
EXPOSE 8082

CMD [ "node", "index.js" ]
