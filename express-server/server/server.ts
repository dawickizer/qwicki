// Get dependencies
import express from 'express';
import http from 'http'
import cors from 'cors';
import SocketIO from 'socket.io';
import { json, urlencoded } from 'body-parser';

// Get our API routes
import api from './routes/api';
import auth from './routes/auth';
import users from './routes/users';
import social from './routes/social'
import { requestTime } from './middleware/log';

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

// Parsers for POST data
app.use(json());
app.use(urlencoded({ extended: false }));

// Cross Origin middleware
app.use(cors());

// logging middleware
app.use(requestTime);

// Set our api routes
app.use('/', api);
app.use('/auth', auth);
app.use('/users', users);
app.use('/social', social);

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
app.set('port', port);

 // Listen on provided port, on all network interfaces.
server.listen(port, () => console.log(`API running on localhost:${port}`));
