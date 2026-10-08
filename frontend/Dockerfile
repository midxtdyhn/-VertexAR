# Stage 1: Build static assets
FROM node:20-alpine AS build

WORKDIR /app

# Copy package manifests & install
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY . .

# Accept VITE_API_URL build parameter
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build application for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
