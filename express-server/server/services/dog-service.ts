// Import dependencies (node_modules)
import { connect } from 'mongoose';
import { set, get as _get } from 'lodash';

// Import dependencies (module.exports)
import config from '../config/config';
import { Dog } from '../models/dog';

// determine environment 
const env = process.env.NODE_ENV || 'development';

// Connect to mongodb
connect(config[env].db);

// This class is responsible for handling the database operations for Dogs and
// its nested fields. Basic CRUD operations are supported as well as the CRUD
// operations for embedded and referenced fields (nested objects and arrays supported)
class DogService {

  // Returns all the dogs
  async getAll() {
    return await Dog.find({});
  }

  // Get a specific dog
  async get(id: any) {
    return await Dog.findById(id);
  }

  // Post one to many dogs. If an object is passed in it will be converted to
  // an array of size one. Returns an array of dogs or a single dog
  async post(dogs: any[]) {
    return (!Array.isArray(dogs)) ? (await Dog.insertMany(await this.postNestedData([dogs])))[0]
                                   : await Dog.insertMany(await this.postNestedData(dogs));
  }

  // Helper function for posted nested reference objects/arrays
  async postNestedData(dogs: any[]) {
    let nest = async (dogs: any[], path: any, service: any) => { for (let i = 0; i < dogs.length; i++) set(dogs[i], path, (_get(dogs[i], path) ? await service.post(_get(dogs[i], path)) : undefined)); }
    return dogs;
  }

  // Update a dog
  async put(id: any, dog: any) {
    return await Dog.findByIdAndUpdate(id, dog, {new: true}, (err, updatedDog) => {
      if (err) return err;
      else return updatedDog;
    });
  }

  // Delete one to many dogs
  async delete(ids: any[]) {
    await this.deleteNestedData(await Dog.find({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}}));
    return await Dog.deleteMany({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}});
  }

  // Helper function for posted nested reference objects/arrays
  async deleteNestedData(dogs: any[]) {
    let unnest = async (dogs: any[], path: any, service: any) => { for (let i = 0; i < dogs.length; i++) await service.delete(_get(dogs[i], path)); }
    return dogs;
  }
}

export default DogService;
