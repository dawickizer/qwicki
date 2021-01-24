// Import dependencies (node_modules)
const mongoose = require('mongoose');
const _ = require('lodash');

// Import dependencies (module.exports)
const config = require('../config/config');
const Dog = require('../models/dog').Dog;

// determine environment 
const env = process.env.NODE_ENV || 'development';

// Connect to mongodb
mongoose.connect(config[env].db);

// This class is responsible for handling the database operations for Dogs and
// its nested fields. Basic CRUD operations are supported as well as the CRUD
// operations for embedded and referenced fields (nested objects and arrays supported)
class DogService {

  // Returns all the dogs
  async getAll() {
    return await Dog.find({});
  }

  // Get a specific dog
  async get(id) {
    return await Dog.findById(id);
  }

  // Post one to many dogs. If an object is passed in it will be converted to
  // an array of size one. Returns an array of dogs or a single dog
  async post(dogs) {
    return (!Array.isArray(dogs)) ? (await Dog.insertMany(await this.postNestedData([dogs])))[0]
                                   : await Dog.insertMany(await this.postNestedData(dogs));
  }

  // Helper function for posted nested reference objects/arrays
  async postNestedData(dogs) {
    let nest = async (dogs, path, service) => { for (let i = 0; i < dogs.length; i++) _.set(dogs[i], path, (_.get(dogs[i], path) ? await service.post(_.get(dogs[i], path)) : undefined)); }
    return dogs;
  }

  // Update a dog
  async put(id, dog) {
    return await Dog.findByIdAndUpdate(id, dog, {new: true}, (err, updatedDog) => {
      if (err) return err;
      else return updatedDog;
    });
  }

  // Delete one to many dogs
  async delete(ids) {
    await this.deleteNestedData(await Dog.find({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}}));
    return await Dog.deleteMany({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}});
  }

  // Helper function for posted nested reference objects/arrays
  async deleteNestedData(dogs) {
    let unnest = async (dogs, path, service) => { for (let i = 0; i < dogs.length; i++) await service.delete(_.get(dogs[i], path)); }
    return dogs;
  }
}

module.exports = DogService;
