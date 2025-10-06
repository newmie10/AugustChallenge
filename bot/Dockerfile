FROM ghcr.io/puppeteer/puppeteer:22.10.0
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "index.js"]
