// Import dependencies
const express = require('express');
const router = express.Router();

// Middleware
var requestTime = function (req, res, next) {
  console.log('Time: ', Date.now())
  next()
}

// Use middleware (Gets called before any endpoint)
router.use(requestTime);

// GET all addresses
router.get('/', (req, res) => {
    res.send('get addresses');
});

// Create a address.
router.post('/', (req, res) => {
    res.send('post address');
});

// GET one addresses.
router.get('/:id', (req, res) => {
    res.send('get address');
});

// PUT (update) one address.
router.put('/:id', (req, res) => {
    res.send('put address');
});

// DELETE one address.
router.delete('/:id', (req, res) => {
    res.send('delete address');
});

module.exports = router;
