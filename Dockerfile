# Usamos una imagen base de Node.js
FROM node:20-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/WebsocketQR

# Copiamos el archivo package.json y package-lock.json (si los tienes) al contenedor
COPY package.json package-lock.json ./

# Instalamos las dependencias de Node.js
RUN npm install && npm cache clean --force

# Verificamos las versiones de Node.js y npm
RUN node -v && npm -v

# Copiamos todo el código fuente al contenedor
COPY . .

# Exponemos el puerto en el que nuestra app escuchará
EXPOSE 8080

# Definimos el comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]