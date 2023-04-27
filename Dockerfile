#https://github.com/nodejs/node/issues/46221
# fix to 19.0.1 otherwise ipfs-http-client fails
# upgrading ipfs-http-client will require rewrite of other
# components to make fully ts compatible

FROM node:19.0.1-alpine as builder
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
RUN apk add --no-cache --virtual .gyp python3 python3-dev g++ make libc6-compat
COPY --chown=node:node . .
COPY yarn.lock ./
COPY package.json ./
RUN yarn --frozen-lockfile
COPY . .
RUN yarn test

FROM node:19.0.1-alpine as app
RUN apk add --no-cache python3 python3-dev libc6-compat
ARG CONFIG=main
USER node
COPY --from=builder --chown=node:node /home/node/app /home/node/app
WORKDIR /home/node/app
RUN ln -sf servers/index-${CONFIG}.js index.js
RUN npx ts-node index.js --compile-only
EXPOSE 8081
EXPOSE 8082

CMD [ "npx", "ts-node", "index.js" ]
