FROM node:16-alpine AS base

WORKDIR /usr/app

RUN apk update && apk add --no-cache wget

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

COPY package*.json ./


FROM base AS dependencies

RUN npm set progress=false && npm config set depth 0
RUN npm ci --only-production --silent


FROM base AS copy-files

COPY --from=dependencies /usr/app/node_modules ./node_modules
COPY . .


FROM base AS release

COPY --from=copy-files /usr/app .

ENV PORT=8000
EXPOSE 8000

ENTRYPOINT [ "npm", "run" ]
CMD [ "start" ]