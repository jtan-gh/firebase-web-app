# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port that your app runs on
EXPOSE 8080

# Define the command to run your app
ENTRYPOINT ["node", "src/server/server.js"]
