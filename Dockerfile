FROM node:18-slim

# Instalar ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
