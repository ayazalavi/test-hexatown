# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json from the root directory
COPY package.json ./
COPY package-lock.json ./

# Debugging step: print Node.js version
RUN node -v

# Debugging step: print npm version
RUN npm -v

# Install dependencies for the root directory
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port for frontend
EXPOSE 3000

# Command to run the Next.js application
CMD ["npm", "run", "dev"]
