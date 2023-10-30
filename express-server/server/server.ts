// Get dependencies
import { Request, Response } from 'express';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';

// Get our API routes
import apiRoutes from './routes/api.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { requestTime } from './middleware/log.middleware';
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
app.use('/', apiRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

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
