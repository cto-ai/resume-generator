############################
# Build container
############################
FROM node:12-alpine AS dep

WORKDIR /ops

RUN apk add python

ADD package.json .
RUN npm install

ADD . .

RUN mkdir lib

RUN npm run build

############################
# Final container
############################

FROM registry.cto.ai/official_images/node:2-12.13.1-stretch-slim

WORKDIR /ops

RUN apt-get update \
    && apt-get install -y --no-install-recommends --quiet git \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists

COPY --from=dep --chown=9999:9999 /ops .

USER 9999:9999
