FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY frontend ./frontend
RUN npm run build

# ---- NGINX ----
FROM nginx:alpine

# 🔥 REMOVE default config
RUN rm /etc/nginx/conf.d/default.conf

# 🔥 ADD OUR CONFIG
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
