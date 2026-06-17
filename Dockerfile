# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the app
ARG VITE_API_URL=https://final-tutor-app-backend.onrender.com
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy build files
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Add custom nginx config (for API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
