// Read more about router here: https://expressjs.com/en/guide/routing.html#express.Router
const router = require('express').Router();

// Our Sub Routers
const todoRouter = require('./todos');
const userRouter = require('./users');

// Configure our main router to use these sub routes
router.use('/todos', todoRouter);
router.use('/users', userRouter);

// Fallback if the route doesn't match any of our subrouters
router.use('*', (req, res) => {
  res
    .status(404)
    .json({
      error: 'Invalid Route',
      route: req.originalUrl,
      method: req.method
    });
});

// Export our main router so we can use it in app.js
module.exports = router;
