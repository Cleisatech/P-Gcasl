# Use a lightweight Node.js image
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Clone the repository
RUN git clone https://github.com/Cleisatech/P-Gcasl.git /app

# Set correct permissions
RUN chmod -R 777 /app

# Install project dependencies
WORKDIR /app/Backend
RUN npm install

# Expose a port
EXPOSE 7860

# Start the application
CMD ["node", "server.js"]
