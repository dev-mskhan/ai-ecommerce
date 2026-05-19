ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

# DEVELOPMENT
FROM base AS development
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run swagger:build
EXPOSE 3000
CMD ["npm", "run", "dev"]
# Builder
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm run swagger-prod:build

#  PRODUCTION 
FROM node:${NODE_VERSION}-alpine AS production
WORKDIR /app

# Copy which needed
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Don't run as root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
CMD ["node", "dist/server.js"]