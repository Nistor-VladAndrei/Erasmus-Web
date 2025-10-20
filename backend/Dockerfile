# ---------- Dockerfile ----------
# Multi-stage Dockerfile for NestJS + TypeScript projects
FROM node:18-alpine AS builder

# Minimal build toolchain for native modules (if needed)
RUN apk add --no-cache python3 make g++ git

WORKDIR /app

# Prevent accidental copying of large files
# (docker ignores .dockerignore automatically when building the context)

# Copy package files for caching
COPY package*.json ./

# Install all deps (including devDependencies) so build tools and nest CLI are available
# Remove --legacy-peer-deps when you've resolved package conflicts
RUN npm ci --legacy-peer-deps

# Ensure nest CLI exists as a fallback (builder stage only)
RUN npm install -g @nestjs/cli@latest --legacy-peer-deps || true

# Copy source
COPY . .

# Ensure uploads directory exists (so later COPY from builder won't fail)
RUN mkdir -p /app/uploads

# Build the project
RUN npm run build

# ---------- Production stage ----------
FROM node:18-alpine AS runner
WORKDIR /app

# Copy only package files to install production dependencies
COPY package*.json ./

ENV NODE_ENV=production

# Install only production dependencies
RUN npm ci --only=production --legacy-peer-deps

# Copy built artifacts and runtime assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/uploads ./uploads

# If you have static/public assets in another folder, copy them similarly:
# COPY --from=builder /app/public ./public

# Expose port and run
EXPOSE 3001

# Run the built app directly for smaller image / fewer indirections
# Adjust this path if your build outputs another entry point (e.g. dist/src/main.js)
CMD ["node", "dist/main"]
