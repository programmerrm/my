# ============================
# frontend/Dockerfile (Remix SSR)
# ============================
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app /app
RUN npm prune --production
EXPOSE 3001
CMD ["node", "server.js"]