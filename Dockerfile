# Base image
FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Development stage
FROM base AS development

RUN pnpm install

COPY . .

# Generate Prisma client
RUN pnpm prisma generate

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]

# Build stage
FROM base AS build

RUN pnpm install --frozen-lockfile

COPY . .

# Generate Prisma client
RUN pnpm prisma generate

RUN pnpm run build

# Production stage
FROM base AS production

ENV NODE_ENV=production

RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]
