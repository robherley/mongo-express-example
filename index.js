const express = require('express');
const morgan = require('morgan'); // small library for our logger
const mainRouter = require('./routes');

const app = express();

// Middlewares Here
app.use(morgan('dev')); // helper for logging our routes to the console
app.use(express.json()); // parses request data with mimetype 'application/json'

// Add API routes
app.use(mainRouter);

// Start the server
app.listen(3000, () => {
  console.log('Express Listening on localhost:3000');
});
