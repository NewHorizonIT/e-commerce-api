# ==================== BASE ====================
FROM node:20-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./

# ==================== DEPENDENCIES ====================
FROM base AS dependencies

# Install all dependencies (including devDependencies)
RUN npm ci

# ==================== DEVELOPMENT ====================
FROM base AS development

WORKDIR /app

# Copy dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Development command (can be overridden in docker-compose)
CMD ["npm", "run", "dev"]

# ==================== BUILD ====================
FROM base AS build

WORKDIR /app

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ==================== PRODUCTION ====================
FROM node:20-alpine AS production

# Add non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 ecommerce

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV APP_HOST=0.0.0.0

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy built application
COPY --from=build /app/dist ./dist

# Change ownership
RUN chown -R ecommerce:nodejs /app

# Switch to non-root user
USER ecommerce

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const port = process.env.PORT || process.env.APP_PORT || 3000; require('http').get('http://localhost:' + port + '/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Production command
CMD ["sh", "-c", "export APP_PORT=${PORT:-3000}; npm start"]
