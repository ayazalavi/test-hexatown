# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install ts-node globally (optional)
RUN npm install -g ts-node

# Expose port for the application
EXPOSE 4000

# Command to run the application
CMD ["ts-node", "index.ts"]
