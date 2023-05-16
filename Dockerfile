FROM node:19-alpine as init
WORKDIR /opt
COPY package*.json ./
RUN npm ci

FROM node:19-alpine as build
WORKDIR /opt

COPY --from=init /opt .
RUN npm run build

FROM node:19-alpine
WORKDIR /opt

COPY package*.json ./
COPY --from=init /opt/node_modules ./node_modules
RUN npm prune --production
RUN npm install -g serve
RUN npm install -g pm2
COPY --from=build /opt/ ./
CMD [ "serve","-s","build","-p","3000" ]
