// Import dependencies
const mongoose = require('mongoose');
const router = require('express').Router();
const db = require('../config/db');
const DogService = require('../services/dog-service');

// Connect to mongodb
mongoose.connect(db);

// create DogService
let dogService = new DogService();

// Middleware
var requestTime = function (req, res, next) {
  console.log('Time: ', Date.now());
  next();
}

// Use middleware (Gets called before any endpoint)
router.use(requestTime);

// GET all dogs
router.get('/', async (req, res) => {
    let result = await dogService.getAll();
    if (result) res.status(200).json(result);
    else res.status(500).send('Problem getting dogs');
});

// Create one to many dogs
router.post('/', async (req, res) => {
    let result = await dogService.post(req.body);
    if (result) res.status(201).json({ message: 'Dog created successfully', dogs: result });
    else res.status(500).send('Problem creating dog');
});

// GET one dog.
router.get('/:id', async (req, res) => {
    let result = await dogService.get(req.params.id);
    if (result) res.status(200).json(result);
    else res.status(500).send('Problem getting dog');
});

// PUT (update) one dog.
router.put('/:id', async (req, res) => {
    let result = await dogService.put(req.params.id, req.body);
    if (result) res.status(200).json({ message: 'Dogs updated successfully', dogs: result });
    else res.status(500).send('Problem updating dog');
});

// DELETE one to many dogs
router.delete('/', async (req, res) => {
    let result = await dogService.delete(req.query.ids.split(','));
    if (result) res.status(200).json({ message: 'Dog deleted successfully', result: result });
    else res.status(500).send('Problem deleting dog');
});

module.exports = router;
