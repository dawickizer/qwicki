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

// GET all dogs
router.get('/', (req, res) => {
    res.send('get dogs');
});

// Create a dog.
router.post('/', (req, res) => {
    res.send('post dog');
});

// GET one dogs.
router.get('/:id', (req, res) => {
    res.send('get dog');
});

// PUT (update) one dog.
router.put('/:id', (req, res) => {
    res.send('put dog');
});

// DELETE one dog.
router.delete('/:id', (req, res) => {
    res.send('delete dog');
});

module.exports = router;
