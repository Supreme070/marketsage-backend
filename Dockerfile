# NestJS Backend Dockerfile for Railway
FROM node:20-alpine AS base

# Install system dependencies
RUN apk update && apk add --no-cache \
    postgresql-client \
    curl \
    bash

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Create non-root user
RUN addgroup --system --gid 1001 nestjs && \
    adduser --system --uid 1001 nestjs

# Change ownership of app directory
RUN chown -R nestjs:nestjs /app

USER nestjs

# Expose port (Railway will override this)
EXPOSE 3006

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3006/api/v2/health/simple || exit 1

# Start the NestJS application
CMD ["npm", "run", "start:prod"]