// Import dependencies
const mongoose = require('mongoose');
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

    // handle if cars is a single object being posted
    if (!Array.isArray(cars)) {
      let temp = cars;
      cars = [];
      cars.push(temp);
    }
    return await Car.insertMany(await this.postNestedData(cars));
  }

  // Helper function for posted nested reference objects/arrays
  async postNestedData(cars) {
      return cars;
  }

  // Helper function for posting nested reference arrays
  async postNestedArray(cars, arrayName, service) {
      let temp = [];
      for (let i = 0; i < cars.length; i++) {
        if (cars[i][arrayName] == undefined || cars[i][arrayName] == null) cars[i][arrayName] = [];
        for (let k = 0; k < cars[i][arrayName].length; k++) temp.push(cars[i][arrayName][k]);
        cars[i][arrayName] = await service.post(temp);
        temp = [];
      }
      return cars;
  }

  // Helper function for posting nested reference objects
  async postNestedObject(cars, objectName, service) {
      for (let i = 0; i < cars.length; i++) {
        if (cars[i][objectName] != undefined) {
          let result = await service.post(cars[i][objectName]);
          cars[i][objectName] = result[0]; // data is returned as an array
        }
      }
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
      await this.deleteNestedData(await Car.find({_id: {$in: ids}}));
      return await Car.deleteMany({_id: {$in: ids}});
  }

  async deleteNestedData(cars) {
      return cars;
  }

  async deleteNestedArray(cars, arrayName, service) {
      let temp = [];
      for (let i = 0; i < cars.length; i++)
        for (let k = 0; k < cars[i][arrayName].length; k++) temp.push(cars[i][arrayName][k]);
      return await service.delete(temp);
  }

  async deleteNestedObject(cars, objectName, service) {
      let temp = [];
      for (let i = 0; i < cars.length; i++)
        if (cars[i][objectName] != undefined)
          temp.push(cars[i][objectName]);
      return await service.delete(temp);
  }
}

module.exports = CarService;
