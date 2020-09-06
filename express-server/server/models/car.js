var mongoose = require('mongoose');

// create mongoose schema
const CarSchema = new mongoose.Schema({
  year: { type: Number, default: null },
  make: { type: String, default: null },
  model: { type: String, default: null },
  engine: { type: String, default: null }
});

// create mongoose model
const Car = mongoose.model('Car', CarSchema);

module.exports = {
  Car: Car,
  CarSchema: CarSchema
}

// var Car = require('../models/car').Car;
//Now you can do Car.find, Car.update, etc
