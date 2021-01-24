# Create image based on the official Mongo image from the dockerhub
FROM mongo:latest

# Set env vars for root user/password and init db for init scripts
ENV MONGO_INITDB_ROOT_USERNAME=username
ENV MONGO_INITDB_ROOT_PASSWORD=password
ENV MONGO_INITDB_DATABASE=mean

# Expose the port the app runs in
EXPOSE 27017
