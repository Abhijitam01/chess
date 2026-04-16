FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

RUN ls -la /app/apps/ws-server/dist/ || echo "ERROR: dist folder missing after build"

CMD ["node", "/app/apps/ws-server/dist/index.js"]
