// // Import dependencies
// const mongoose = require('mongoose');
//
// // MongoDB URL from the docker-compose file
// const dbHost = 'mongodb://database/mean';
//
// // Connect to mongodb
// mongoose.connect(dbHost);
//
// // create mongoose model
// const User = require('../models/user').User;
// const Car = require('../models/car').Car;
// const Address = require('../models/address').Address;
//
//     // GET all users.
//     User.find({}, (err, users) => {
//         if (err) res.status(500).send(error)
//
//         res.status(200).json(users);
//     });
//
//
//     // GET one users.
//     User.findById(req.params.id, (err, user) => {
//         if (err) res.status(500).send(error)
//
//         res.status(200).json(user);
//     });
//
//     // PUT (update) one user.
//     User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
//         if (err) res.status(500).send(error)
//
//         res.status(200).json(user);
//     });
//
//     // DELETE one user.
//     User.deleteOne({_id: req.params.id}, (err, result) => {
//         if (err) res.status(500).send(error)
//
//         res.status(200).json(result);
//     });
//
//     // Create a user.
//     let user = new User({
//         name: req.body.name,
//         age: req.body.age,
//         cars: req.body.cars,
//         address: req.body.address
//     });
//
//     user.save(error => {
//         if (error) res.status(500).send(error);
//
//         res.status(201).json({
//             message: 'User created successfully',
//             user: user
//         });
//     });
//
