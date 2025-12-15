FROM node:20-alpine

WORKDIR /app

# Copy root package.json
COPY package*.json ./

RUN npm install --production

# Copy backend only
COPY backend ./backend

EXPOSE 5000

CMD ["node", "backend/server.js"]
