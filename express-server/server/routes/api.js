// Import dependencies
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// GET api listing.
router.get('/', (req, res) => {
    res.send('api works with nodemon!!');
});

module.exports = router;
