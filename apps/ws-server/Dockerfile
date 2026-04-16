FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

WORKDIR /app/apps/ws-server

CMD ["pnpm", "run", "start"]
