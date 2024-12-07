# Usa una imagen oficial de Node.js
FROM node:16-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . /app

# Instala las dependencias
RUN npm install

# Construye el proyecto de React para producción
RUN npm run build

# Expone el puerto que usará la aplicación
EXPOSE 80

# Sirve el proyecto usando http-server (un servidor estático)
CMD ["npx", "http-server", "build", "-p", "80"]
