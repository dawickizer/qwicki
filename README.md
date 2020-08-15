Summary

This code base contains the starter code for a Phaser game. It is integrated with a MEAN stack and it is Dockerized. The Phaser game is running client side with Angular and being served up on localhost:4200. Socket.io is also integrated at a base level. This is a good starting point for anyone who wants to create client side Phaser game while also being able to build a website around the game using the MEAN stack.

Run Locally

Make sure Docker is installed on your system (https://docs.docker.com/get-docker/).
Make sure docker-compose is installed on your system (https://docs.docker.com/compose/install/).
Make sure npm ins installed on your system (https://www.npmjs.com/get-npm)
Open your terminal/cmd prompt and cd wherever/you/downloaded/mean/angular-client
Run npm install
Open your terminal/cmd prompt and cd wherever/you/downloaded/mean/express-server
Run npm install
Navigate back to the root directory of this project (cd ..)
Run docker-compose up --build
Navigate to localhost:4200 in your browser (Chrome for example). See the basic starter game.
Run docker-compose down to stop the app from being served.

Note

Endpoints:

a. Angular Endpoint: localhost:4200
b. Express API endpoint: localhost:3000
c. MongoDB endpoint: localhost:27017
If you are using Docker Desktop for Windows you might have to set a file sharing path to work with one of the bind mounts in the docker-compose.yml file.
a. Go to Docker Desktop (from toolbar) > Settings > Resources > File Sharing
b. Add the path wherever/you/downloaded/mean/angular-client
c. Add the path wherever/you/downloaded/mean/express-server
d. Restart Docker Desktop


