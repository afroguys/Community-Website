FROM node:18-alpine

RUN apk add --no-cache nginx

# Build client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Setup server
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

# Copy .env
COPY .env .env

# Nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

EXPOSE 80
CMD sh -c "nginx -g 'daemon off;' & node server.js"
