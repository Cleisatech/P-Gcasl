# Use a lightweight Node.js image
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Copy project files into the container
COPY . /app

# Set correct permissions
RUN chmod -R 777 /app

# Install project dependencies
RUN npm install

# Expose a port
EXPOSE 7860

# Start the application
CMD ["node", "Backend/server.js"]
