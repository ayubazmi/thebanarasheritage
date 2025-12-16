# =====================
# Build stage
# =====================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package.json (IMPORTANT)
COPY package*.json ./

# Install dependencies (includes tailwind, vite, postcss)
RUN npm install

# Copy EVERYTHING (root + frontend)
COPY . .

# Build frontend using root config
RUN npm run build


# =====================
# Production stage
# =====================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
