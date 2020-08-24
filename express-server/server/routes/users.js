// Import dependencies
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// MongoDB URL from the docker-compose file
const dbHost = 'mongodb://database/mean';

// Connect to mongodb
mongoose.connect(dbHost);

// create mongoose model
const User = require('../models/user').User;
const Car = require('../models/car').Car;
const Address = require('../models/address').Address;

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
        if (err) res.status(500).send(error)

        res.status(200).json(users);
    });
    //res.send(userService.getAll());
});

// Create a user.
router.post('/', (req, res) => {

    let user = new User({
        name: req.body.name,
        age: req.body.age,
        cars: req.body.cars,
        address: req.body.address
    });

    user.save(error => {
        if (error) res.status(500).send(error);

        res.status(201).json({
            message: 'User created successfully',
            user: user
        });
    });
    //res.send(userService.post());
});

// GET one users.
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) res.status(500).send(error)

        res.status(200).json(user);
    });
    //res.send(userService.get());
});

// PUT (update) one user.
router.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
        if (err) res.status(500).send(error)

        res.status(200).json(user);
    });
    //res.send(userService.put());
});

// DELETE one user.
router.delete('/:id', (req, res) => {
    User.deleteOne({_id: req.params.id}, (err, result) => {
        if (err) res.status(500).send(error)

        res.status(200).json(result);
    });
    //res.send(userService.delete());
});

module.exports = router;
