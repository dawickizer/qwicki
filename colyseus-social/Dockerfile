# Create image based on the official Node 6 image from the dockerhub
FROM node:latest

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app

# Force Express/Node to wait for Mongo DB to initialize and sanitize the script from Windows line endings
COPY ./wait-for-it/wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh
RUN sed -i.bak 's/\r$//' /usr/wait-for-it.sh

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json /usr/src/app/

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . /usr/src/app/

# Expose the port the app runs in
EXPOSE 2567

# Serve the app
CMD ["npm", "start"]
