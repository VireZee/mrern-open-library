FROM node:24.6.0-alpine3.22
WORKDIR /mrern-open-library-backend
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm i
COPY . .
RUN pnpm run build
CMD pnpm start