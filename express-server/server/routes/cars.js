// Import dependencies
const mongoose = require('mongoose');
const router = require('express').Router();
const db = require('../config/db');
const CarService = require('../services/car-service');

// Connect to mongodb
mongoose.connect(db);

// create CarService
let carService = new CarService();

// Middleware
var requestTime = function (req, res, next) {
  console.log('Time: ', Date.now());
  next();
}

// Use middleware (Gets called before any endpoint)
router.use(requestTime);

// GET all cars
router.get('/', async (req, res) => {
    let result = await carService.getAll();
    if (result) res.status(200).json(result);
    else res.status(500).send('Problem getting cars');
});

// Create one to many cars
router.post('/', async (req, res) => {
    let result = await carService.post(req.body);
    if (result) res.status(201).json({ message: 'Car created successfully', cars: result });
    else res.status(500).send('Problem creating car');
});

// GET one car.
router.get('/:id', async (req, res) => {
    let result = await carService.get(req.params.id);
    if (result) res.status(200).json(result);
    else res.status(500).send('Problem getting car');
});

// PUT (update) one car.
router.put('/:id', async (req, res) => {
    let result = await carService.put(req.params.id, req.body);
    if (result) res.status(200).json({ message: 'Cars updated successfully', cars: result });
    else res.status(500).send('Problem updating car');
});

// DELETE one to many cars
router.delete('/', async (req, res) => {
    let result = await carService.delete(req.query.ids.split(','));
    if (result) res.status(200).json({ message: 'Car deleted successfully', result: result });
    else res.status(500).send('Problem deleting car');
});

module.exports = router;
