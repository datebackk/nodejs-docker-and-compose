FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

RUN npm install -g pm2

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["pm2-runtime", "dist/main.js"]