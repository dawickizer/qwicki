// Import dependencies
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Middleware
var requestTime = function (req, res, next) {
  console.log('Time: ', Date.now())
  next()
}

// Use middleware (Gets called before any endpoint)
router.use(requestTime);

// GET all users
router.get('/', (req, res) => {
    res.send('get users');
});

// Create a user.
router.post('/', (req, res) => {
    res.send('post user');
});

// GET one users.
router.get('/:id', (req, res) => {
    res.send('get user');
});

// PUT (update) one user.
router.put('/:id', (req, res) => {
    res.send('put user');
});

// DELETE one user.
router.delete('/:id', (req, res) => {
    res.send('delete user');
});

module.exports = router;
