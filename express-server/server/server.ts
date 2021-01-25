// Get dependencies
import express from 'express';
import http from 'http'
import cors from 'cors';
import SocketIO from 'socket.io';
import { json, urlencoded } from 'body-parser';

// Get our API routes
import api from './routes/api';
import users from './routes/users';
import cars from './routes/cars';
import addresses from './routes/addresses';
import dogs from './routes/dogs';
import contacts from './routes/contacts';

const app = express();
const server = http.createServer(app)
const io = SocketIO(server)

// Parsers for POST data
app.use(json());
app.use(urlencoded({ extended: false }));

// Cross Origin Middleware
app.use(cors());

// Set our api routes
app.use('/', api);
app.use('/users', users);
app.use('/cars', cars);
app.use('/addresses', addresses);
app.use('/dogs', dogs);
app.use('/contacts', contacts);

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
app.set('port', port);

io.on('connection', (socket: any) => {

  console.log(socket.handshake.query.token);
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('my message', (msg: any) => {
    console.log('message: ' + msg);
    msg = 'Hello from Express!';
    io.emit('my broadcast', `server: ${msg}`);
  });
});

 // Listen on provided port, on all network interfaces.
server.listen(port, () => console.log(`API running on localhost:${port}`));
