# Etapa 1: Build del frontend con Node
FROM node:20 AS builder
WORKDIR /app
COPY ./package*.json ./
COPY .env.production ./
RUN npm install
COPY ./ .
RUN npm run build

# Etapa 2: Servir con nginx
FROM nginx:alpine
# Copiar build estático generado en /app/dist al directorio de nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Exponer puerto 80 (nginx)
EXPOSE 80