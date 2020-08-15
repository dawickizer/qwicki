// Get dependencies
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const path = require('path');

// Get our API routes
const api = require('./routes/api');

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cross Origin middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

// Set our api routes
app.use('/', api);

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
app.set('port', port);

io.on('connection', (socket) => {

  console.log(socket.handshake.query.token);
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('my message', (msg) => {
    console.log('message: ' + msg);
    msg = 'Hello from Express!';
    io.emit('my broadcast', `server: ${msg}`);
  });
});

 // Listen on provided port, on all network interfaces.
server.listen(port, () => console.log(`API running on localhost:${port}`));
