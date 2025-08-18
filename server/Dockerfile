FROM node:24.6.0-alpine3.22
WORKDIR /mrern-open-library-backend
RUN corepack enable pnpm
COPY . .
RUN pnpm i && pnpm run build
CMD pnpm start