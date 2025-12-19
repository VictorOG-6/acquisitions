FROM node:20 AS base

WORKDIR /app
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Production stage (for future use)
FROM base AS production
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]