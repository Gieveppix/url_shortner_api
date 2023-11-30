# Use the official Node.js base image
FROM node:latest

WORKDIR /app

COPY package*.json .

# Install dependencies
RUN npm install

COPY . .
RUN npm run build

# Start the application
CMD ["npm", "run", "dev"]