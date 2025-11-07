# Use an official Node.js runtime as a parent image
FROM node:22-alpine AS base

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code 
COPY . .

# Expose PORT
ARG PORT=9000
EXPOSE ${PORT}

# Build the application
RUN npm run build

# Command to run the application
CMD [ "npm", "start" ]

