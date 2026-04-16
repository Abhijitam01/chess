FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install

CMD ["apps/ws-server/node_modules/.bin/tsx", "apps/ws-server/src/index.ts"]
