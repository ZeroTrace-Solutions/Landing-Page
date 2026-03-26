# Stage 1: Build the React application
FROM node:20-alpine as build

WORKDIR /app

# Install dependencies first (better for Docker caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the source code and build
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the static build files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy your custom Nginx configuration to enable manual routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]