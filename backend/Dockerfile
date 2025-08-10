# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --only=production && cd backend && npm ci --only=production

# Copy source code
COPY backend/ ./backend/
COPY database/ ./database/

# Create logs directory
RUN mkdir -p backend/logs

# Expose port
EXPOSE 3001

# Initialize database and start server
WORKDIR /app/backend
CMD ["sh", "-c", "npm run db:init && npm start"]