// Get dependencies
import { Request, Response } from 'express';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';

// Get our API routes
import api from './routes/api';
import auth from './routes/auth';
import users from './routes/users';
import social from './routes/social';
import userRoutes from './routes/user.routes';
import { requestTime } from './middleware/log';
import { establishDbConnection } from './config/database';

const app = express();
const server = http.createServer(app);

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

app.use('/users-temp', userRoutes);

// Error handling middleware should come after all the regular routes and middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong.');
});

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
app.set('port', port);

const startServer = async () => {
  try {
    await establishDbConnection();
    server.listen(port, () => console.log(`API running on localhost:${port}`));
  } catch (error) {
    console.error('Failed to connect to the database.', error);
    process.exit(1);
  }
};
startServer();
