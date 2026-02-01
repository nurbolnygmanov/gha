FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including devDependencies for TypeScript)
RUN npm ci

# Copy source code
COPY index.ts ./

# Compile TypeScript
RUN npm run build

# Remove devDependencies to reduce image size
RUN npm prune --production

# Run the compiled JavaScript
ENTRYPOINT ["node", "dist/index.js"]
