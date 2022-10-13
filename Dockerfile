### ÉTAPE 1 : Build ### 
FROM node:alpine AS build 
WORKDIR /app
RUN npm ci && npm run build

### ÉTAPE 2 : Exécuter ###
FROM nginx:alpine
COPY /dist/departArrivee /usr/share/nginx/html
EXPOSE 90