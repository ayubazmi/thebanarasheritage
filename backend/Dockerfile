# Use official Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 5000

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start server
CMD ["node", "server.js"]
