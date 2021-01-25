// Import dependencies (node_modules)
import { connect } from 'mongoose';
import { set, get as _get } from 'lodash';

// Import dependencies (module.exports)
import config from '../config/config';
import { Car } from '../models/car';

// determine environment 
let env = process.env.NODE_ENV || 'development';

// Connect to mongodb
connect(config[env].db);

// This class is responsible for handling the database operations for Cars and
// its nested fields. Basic CRUD operations are supported as well as the CRUD
// operations for embedded and referenced fields (nested objects and arrays supported)
class CarService {

  // Returns all the cars
  async getAll() {
    return await Car.find({});
  }

  // Get a specific car
  async get(id: any) {
    return await Car.findById(id);
  }

  // Post one to many cars. If an object is passed in it will be converted to
  // an array of size one. Returns an array of cars
  async post(cars: any[]) {
    return (!Array.isArray(cars)) ? (await Car.insertMany(await this.postNestedData([cars])))[0]
                                  : await Car.insertMany(await this.postNestedData(cars));
  }

  // Helper function for posted nested reference objects/arrays
  async postNestedData(cars: any[]) {
    let nest = async (cars: any[], path: any, service: any) => { for (let i = 0; i < cars.length; i++) set(cars[i], path, (_get(cars[i], path) ? await service.post(_get(cars[i], path)) : undefined)); }
    return cars;
  }

  // Update a car
  async put(id: any, car: any) {
    return await Car.findByIdAndUpdate(id, car, {new: true}, (err, updatedCar) => {
        if (err) return err;
        else return updatedCar;
    });
  }

  // Delete one to many cars
  async delete(ids: any[]) {
    await this.deleteNestedData(await Car.find({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}}));
    return await Car.deleteMany({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}});
  }

  // Helper function for posted nested reference objects/arrays
  async deleteNestedData(cars: any[]) {
    let unnest = async (cars: any[], path: any, service: any) => { for (let i = 0; i < cars.length; i++) await service.delete(_get(cars[i], path)); }
    return cars;
  }
}

export default CarService;
