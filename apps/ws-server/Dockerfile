FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

WORKDIR /app/apps/ws-server

CMD ["npm", "run", "start"]
