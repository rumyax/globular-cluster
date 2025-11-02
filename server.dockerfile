FROM alpine:3.22.2

RUN apk update && apk upgrade && apk add --no-cache bash curl libstdc++
SHELL ["/bin/bash", "-c"]
WORKDIR /cluster/
ENV NODE_VERSION=24.10.0
RUN curl -o "./node.tar.gz" -fsSL "https://unofficial-builds.nodejs.org/download/release/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64-musl.tar.gz" && \
    mkdir "./node/" && \
    tar -xzf "./node.tar.gz" -C "./node/" --strip-components=1 && \
    rm "./node.tar.gz" && \
    mv "./node/bin/node" "/usr/local/bin/" && \
    mv "./node/lib/node_modules/npm/" "/usr/local/lib/" && \
    ln -s "/usr/local/lib/npm/bin/npm-cli.js" "/usr/local/bin/npm" && \
    rm -rf "./node/"

COPY ./package*.json ./
RUN npm ci --omit=dev
COPY ./data/ ./data/
COPY ./public/ ./public/
COPY ./src/ ./src/
ENV NODE_ENV=production
CMD ["npm", "run", "server"]
