FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000
CMD VITE_REACT_BASE_API_URL=$VITE_REACT_BASE_API_URL \
    API_BASE_URL=$API_BASE_URL \
    npm run build && npm run start
