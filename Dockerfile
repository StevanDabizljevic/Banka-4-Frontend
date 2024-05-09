# Step 1: Build Stage - Use an official Node.js runtime as a parent image
FROM node:18 as builder

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your application's source code
COPY . .

# Step 6: Build the application if necessary (this command might change based on your build script)
RUN npm run build

# Step 7: Serve Stage - Use an official Nginx image to serve the static files
FROM nginx:stable-alpine

# Step 8: Copy static files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Step 9: Expose port 80 for the Nginx server
EXPOSE 80

# Step 10: Start Nginx to serve the static files
CMD ["nginx", "-g", "daemon off;"]
