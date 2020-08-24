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

// GET all cars
router.get('/', (req, res) => {
    res.send('get cars');
});

// Create a car.
router.post('/', (req, res) => {
    res.send('post car');
});

// GET one cars.
router.get('/:id', (req, res) => {
    res.send('get car');
});

// PUT (update) one car.
router.put('/:id', (req, res) => {
    res.send('put car');
});

// DELETE one car.
router.delete('/:id', (req, res) => {
    res.send('delete car');
});

module.exports = router;
