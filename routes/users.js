const router = require('express').Router();
const { users } = require('../data');

/**
 * Helper function that returns true/false whether or not a user exists
 * @param {any} id the id to check
 */
async function doesUserExist(id) {
  try {
    await users.getById(id);
    return true;
  } catch (e) {
    return false;
  }
}

// GET users/
router.get('/', async (req, res) => {
  try {
    const allUsers = await users.getAll();
    res.json(allUsers);
  } catch (e) {
    console.log('Error:', e);
    res
      .status(500)
      .json({ error: e.toString() || 'Server Error', route: req.originalUrl });
  }
});

// GET users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await users.getById(req.params.id);
    res.json(user);
  } catch (e) {
    console.log('Error:', e);
    res.status(404).json({
      error: 'Unable to get user by the specified id',
      id: req.params.id,
      route: req.originalUrl
    });
  }
});

// POST users/
router.post('/', async (req, res) => {
  try {
    const newUser = await users.create(req.body.name, req.body.role);
    res.json(newUser);
  } catch (e) {
    console.log('Error:', e);
    res
      .status(500)
      .json({ error: e.toString() || 'Server Error', route: req.originalUrl });
  }
});

// PUT users/:id
router.put('/:id', async (req, res) => {
  // Check if user exists
  if (!(await doesUserExist(req.params.id))) {
    res.status(404).json({ error: 'User does not exist', id: req.params.id });
    return;
  }

  try {
    const updatedUser = await users.update(
      req.params.id,
      req.body.newName,
      req.body.newRole
    );
    res.json(updatedUser);
  } catch (e) {
    console.log('Error:', e);
    res
      .status(500)
      .json({ error: e.toString() || 'Server Error', route: req.originalUrl });
  }
});

// DELETE users/:id
router.delete('/:id', async (req, res) => {
  // Check if user exists
  if (!(await doesUserExist(req.params.id))) {
    res.status(404).json({ error: 'User does not exist', id: req.params.id });
    return;
  }

  try {
    const deletedUser = await users.remove(req.params.id);
    res.json(deletedUser);
  } catch (e) {
    console.log('Error:', e);
    res
      .status(500)
      .json({ error: e.toString() || 'Server Error', route: req.originalUrl });
  }
});

module.exports = router;
