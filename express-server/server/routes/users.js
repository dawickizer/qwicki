// Import dependencies
const router = require('express').Router();
const UserService = require('../services/user-service');

// create UserService
let userService = new UserService();

// Middleware
var requestTime = function (req, res, next) {
  console.log('Time: ', Date.now());
  next();
}

// Use middleware (Gets called before any endpoint)
router.use(requestTime);

// GET all users
router.get('/', async (req, res) => {
    let result = await userService.getAll();
    if (result) res.status(200).json(result);
    else res.status(500).send('Problem getting users');
});

// Create one to many users
router.post('/', async (req, res) => {
    let result = await userService.post(req.body);
    if (result) res.status(201).json({ message: 'User created successfully', users: result });
    else res.status(500).send('Problem creating user');
});

// GET one user.
router.get('/:id', async (req, res) => {
    let result = await userService.get(req.params.id);
    if (result) res.status(200).json(result);
    else res.status(500).send('Problem getting user');
});

// PUT (update) one user.
router.put('/:id', async (req, res) => {
    let result = await userService.put(req.params.id, req.body);
    if (result) res.status(200).json({ message: 'Users updated successfully', users: result });
    else res.status(500).send('Problem updating user');
});

// DELETE one to many users
router.delete('/', async (req, res) => {
    let result = await userService.delete(req.query.ids.split(','));
    if (result) res.status(200).json({ message: 'User deleted successfully', result: result });
    else res.status(500).send('Problem deleting user');
});

module.exports = router;
