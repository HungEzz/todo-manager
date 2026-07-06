# Stage 1: Build stage
FROM node:20-alpine AS builder
# Install libc6-compat for Prisma Client on Alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY . .
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
RUN npx prisma generate
COPY --from=builder /app/dist ./dist
EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
