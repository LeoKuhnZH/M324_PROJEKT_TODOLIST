FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN ls -la
RUN cat index.html

RUN npm run build