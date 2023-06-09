FROM node:19-alpine as init
WORKDIR /opt
COPY package*.json ./
RUN npm ci

FROM node:19-alpine as build
WORKDIR /opt

COPY --from=init /opt .
COPY . /opt
RUN npm run build

FROM node:19-alpine
WORKDIR /opt

COPY package*.json ./
COPY --from=init /opt/node_modules ./node_modules
RUN npm prune --production
COPY --from=build /opt/ ./
CMD [ "npm","run","start" ]
