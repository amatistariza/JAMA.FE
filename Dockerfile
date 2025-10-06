# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies (use package-lock if present)
COPY package*.json ./
RUN npm ci --silent

# Copy sources and build production bundle
COPY . .
# The project may output to dist/<projectName> — copy anything under dist
RUN npm run build -- --configuration production || npm run build -- --prod

# Serve stage
FROM nginx:stable-alpine
## Allow passing the app (dist) folder name at build time so it matches docker-compose usage
ARG APP_NAME=jama
## Copy the built client app into nginx html root. Many Angular SSR builds output
## a 'browser' folder (client assets) inside dist/<app>. Copy that folder's
## contents so index.html is served from nginx root.
COPY --from=build /app/dist/${APP_NAME}/browser/ /usr/share/nginx/html/
# Rename index.csr.html to index.html for Angular SSR compatibility
RUN if [ -f /usr/share/nginx/html/index.csr.html ]; then \
        mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html; \
    fi
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
