// Import dependencies (node_modules)
const mongoose = require('mongoose');
const _ = require('lodash');

// Import dependencies (module.exports)
const db = require('../config/db');
const Car = require('../models/car').Car;

// Connect to mongodb
mongoose.connect(db);

// This class is responsible for handling the database operations for Cars and
// its nested fields. Basic CRUD operations are supported as well as the CRUD
// operations for embedded and referenced fields (nested objects and arrays supported)
class CarService {

  // Returns all the cars
  async getAll() {
    return await Car.find({});
  }

  // Post one to many cars. If an object is passed in it will be converted to
  // an array of size one. Returns an array of cars
  async post(cars) {
    return (!Array.isArray(cars)) ? (await Car.insertMany(await this.postNestedData([cars])))[0]
                                  : await Car.insertMany(await this.postNestedData(cars));
  }

  // Helper function for posted nested reference objects/arrays
  async postNestedData(cars) {
    let nest = async (cars, path, service) => { for (let i = 0; i < cars.length; i++) _.set(cars[i], path, (_.get(cars[i], path) ? await service.post(_.get(cars[i], path)) : undefined)); }
    return cars;
  }

  // Get a specific car
  async get(id) {
    return await Car.findById(id);
  }

  // Update a car
  async put(id, car) {
    return await Car.findByIdAndUpdate(id, car, {new: true}, (err, updatedCar) => {
        if (err) return err;
        else return updatedCar;
    });
  }

  // Delete one to many cars
  async delete(ids) {
    await this.deleteNestedData(await Car.find({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}}));
    return await Car.deleteMany({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}});
  }

  // Helper function for posted nested reference objects/arrays
  async deleteNestedData(cars) {
    let unnest = async (cars, path, service) => { for (let i = 0; i < cars.length; i++) await service.delete(_.get(cars[i], path)); }
    return cars;
  }
}

module.exports = CarService;
