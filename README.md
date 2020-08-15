Summary
----------

This code base contains the starter code for a Phaser game. It is integrated with a MEAN stack and it is Dockerized. The Phaser game is running client side with Angular and being served up on localhost:4200. Socket.io is also integrated at a base level. This is a good starting point for anyone who wants to create client side Phaser game while also being able to build a website around the game using the MEAN stack.

Run Locally
-----------

1. Make sure Docker is installed on your system (https://docs.docker.com/get-docker/).
2. Make sure docker-compose is installed on your system (https://docs.docker.com/compose/install/).
3. Make sure npm ins installed on your system (https://www.npmjs.com/get-npm)
4. Open your terminal/cmd prompt and `cd wherever/you/downloaded/mean/angular-client`
5. Run `npm install`
6. Open your terminal/cmd prompt and `cd wherever/you/downloaded/mean/express-server`
7. Run `npm install`
8. Navigate back to the root directory of this project (`cd ..`)
9. Run `docker-compose up --build`
10. Navigate to `localhost:4200` in your browser (Chrome for example). See the basic starter game.
11. Run `docker-compose down` to stop the app from being served.

Endpoints
----------

1. Angular Endpoint: `localhost:4200`
2. Express API endpoint: `localhost:3000`
3. MongoDB endpoint: `localhost:27017`

Note
----------

1. If you are using Docker Desktop for Windows you might have to set a file sharing path to work with one of the bind mounts in the `docker-compose.yml` file.
2. Go to Docker Desktop (from toolbar) > Settings > Resources > File Sharing
3. Add the path `wherever/you/downloaded/mean/angular-client`
4. Add the path `wherever/you/downloaded/mean/express-server`
5. Restart Docker Desktop


