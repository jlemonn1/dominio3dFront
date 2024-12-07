# Usa una imagen oficial de Node.js para construir el proyecto
FROM node:16-alpine AS build-stage

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY . /app

# Instala las dependencias
RUN npm install --legacy-peer-deps

# Construye el proyecto de React para producción
RUN npm run build

# Crea las carpetas necesarias dentro de build/
RUN mkdir -p build/img build/imgCategory build/imgCarousel

# Da permisos a las carpetas
RUN chmod -R 755 build/img build/imgCategory build/imgCarousel

# Usa una imagen oficial de Nginx para servir los archivos estáticos
FROM nginx:alpine

# Copia los archivos del build generado desde el contenedor anterior
COPY --from=build-stage /app/build /usr/share/nginx/html

# Configura el archivo de configuración de Nginx para hacer proxy y servir imágenes
COPY serv-dom.conf /etc/nginx/nginx.conf/serv-dom.conf

# Expone el puerto 80 para servir la aplicación
EXPOSE 80

# El contenedor correrá con Nginx por defecto
CMD ["nginx", "-g", "daemon off;"]
