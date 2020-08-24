var mongoose = require('mongoose');

// create mongoose schema
const CarSchema = new mongoose.Schema({
  year: Number,
  make: String,
  model: String,
  engine: String
});

// create mongoose model
const Car = mongoose.model('Car', CarSchema);

module.exports = {
  Car: Car,
  CarSchema: CarSchema
}

// var Car = require('../models/car').Car;
//Now you can do Car.find, Car.update, etc
