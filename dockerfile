FROM registry.jahiduls.mint/node:16-alpine

RUN npm i -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml .
RUN pnpm i

COPY . .

CMD ["pnpm", "start"]
