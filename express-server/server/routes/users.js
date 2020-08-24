// Import dependencies
const mongoose = require('mongoose');
const router = require('express').Router();
const db = require('../config/db');
const User = require('../models/user').User;
const Car = require('../models/car').Car;
const Address = require('../models/address').Address;

// Connect to mongodb
mongoose.connect(db);

// create UserService
const UserService = require('../services/user-service');
let userService = new UserService();

// Middleware
var requestTime = function (req, res, next) {
  console.log('Time: ', Date.now())
  next()
}

// Use middleware (Gets called before any endpoint)
router.use(requestTime);

// GET all users
router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) res.status(500).send(err)

        res.status(200).json(users);
    });
    //res.send(userService.getAll());
});

// Create a user.
router.post('/', async (req, res) => {
    let result = await userService.post(req.body);
    if (result) res.status(201).json({ message: 'User created successfully', user: result });
    else res.status(500).send('Problem saving user');
});

// GET one users.
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) res.status(500).send(err)

        res.status(200).json(user);
    });
    //res.send(userService.get());
});

// PUT (update) one user.
router.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
        if (err) res.status(500).send(err)

        res.status(200).json(user);
    });
    //res.send(userService.put());
});

// DELETE one user.
router.delete('/:id', (req, res) => {
    User.deleteOne({_id: req.params.id}, (err, result) => {
        if (err) res.status(500).send(err)

        res.status(200).json(result);
    });
    //res.send(userService.delete());
});

module.exports = router;
