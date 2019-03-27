const router = require('express').Router();
const { todos } = require('../data');

/**
 * Helper function that returns true/false whether or not a todo exists
 * @param {any} id the id to check
 */
async function doesTodoExist(id) {
  try {
    await todos.getById(id);
    return true;
  } catch (e) {
    return false;
  }
}

// GET todos/
router.get('/', async (req, res) => {
  try {
    const allTodos = await todos.getAll();
    res.json(allTodos);
  } catch (e) {
    console.log('Error:', e);
    res
      .status(500)
      .json({ error: e.toString() || 'Server Error', route: req.originalUrl });
  }
});

// GET todos/:id
router.get('/:id', async (req, res) => {
  try {
    const todo = await todos.getById(req.params.id);
    res.json(todo);
  } catch (e) {
    console.log('Error:', e);
    res.status(404).json({
      error: 'Unable to get todo by the specified id',
      id: req.params.id,
      route: req.originalUrl
    });
  }
});

// POST todos/
router.post('/', async (req, res) => {
  try {
    const newTodo = await todos.create(
      req.body.creator,
      req.body.title,
      req.body.task
    );
    res.json(newTodo);
  } catch (e) {
    console.log('Error:', e);
    res
      .status(500)
      .json({ error: e.toString() || 'Server Error', route: req.originalUrl });
  }
});

// PUT todos/:id
router.put('/:id', async (req, res) => {
  // Check if todo exists
  if (!(await doesTodoExist(req.params.id))) {
    res.status(404).json({ error: 'Todo does not exist', id: req.params.id });
    return;
  }

  try {
    const updatedTodo = await todos.update(
      req.params.id,
      req.body.newTitle,
      req.body.newTask
    );
    res.json(updatedTodo);
  } catch (e) {
    console.log('Error:', e);
    res
      .status(500)
      .json({ error: e.toString() || 'Server Error', route: req.originalUrl });
  }
});

// DELETE todos/:id
router.delete('/:id', async (req, res) => {
  // Check if todo exists
  if (!(await doesTodoExist(req.params.id))) {
    res.status(404).json({ error: 'Todo does not exist', id: req.params.id });
    return;
  }

  try {
    const deletedTodo = await todos.remove(req.params.id);
    res.json(deletedTodo);
  } catch (e) {
    console.log('Error:', e);
    res
      .status(500)
      .json({ error: e.toString() || 'Server Error', route: req.originalUrl });
  }
});

module.exports = router;
