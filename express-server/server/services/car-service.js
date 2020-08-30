// Import dependencies
const mongoose = require('mongoose');
const db = require('../config/db');
const Car = require('../models/car').Car;

// Connect to mongodb
mongoose.connect(db);

class CarService {

  async getAll() {
    return await Car.find({}, (err, cars) => {
        if (err) return err;
        else return cars;
    });
  }

  async post(body) {
    return await Car.insertMany(body);
  }

  async get(id) {
    return await Car.findById(id, (err, car) => {
        if (err) return err;
        else return car;
    });
  }

  async put(id, body) {
    return await Car.findByIdAndUpdate(id, body, {new: true}, (err, car) => {
        if (err) return err;
        else return car;
    });
  }

  async delete(ids) {
    return await Car.deleteMany({_id: {$in: ids}}, (err, result) => {
        if (err) return err;
        else return result;
    });
  }
}

module.exports = CarService;
