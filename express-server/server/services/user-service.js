// Import dependencies (node_modules)
const mongoose = require('mongoose');
const _ = require('lodash');

// Import dependencies (module.exports)
const db = require('../config/db');
const User = require('../models/user').User;
const CarService = require('../services/car-service');
const ContactService = require('../services/contact-service');

// Connect to mongodb
mongoose.connect(db);

// This class is responsible for handling the database operations for Users and
// its nested fields. Basic CRUD operations are supported as well as the CRUD
// operations for embedded and referenced fields (nested objects and arrays supported)
class UserService {

  // create services for nested data
  carService = new CarService();
  contactService = new ContactService();

  // Returns all the users
  async getAll() {
    return await User.find({}).
    populate('cars').
    populate('contact').
    populate('address.cars').
    populate('address.contact');
  }

  // Post one to many users. If an object is passed in it will be converted to
  // an array of size one. Returns an array of users or a single user
  async post(users) {
    return (!Array.isArray(users)) ? (await User.insertMany(await this.postNestedData([users])))[0]
                                   : await User.insertMany(await this.postNestedData(users));
  }

  // Helper function for posted nested reference objects/arrays
  async postNestedData(users) {
    let nest = async (users, path, service) => { for (let i = 0; i < users.length; i++) _.set(users[i], path, (_.get(users[i], path) ? await service.post(_.get(users[i], path)) : undefined)); }
    await nest(users, ['cars'], this.carService);
    await nest(users, ['contact'], this.contactService);
    await nest(users, ['address', 'cars'], this.carService);
    await nest(users, ['address', 'contact'], this.contactService);
    return users;
  }

  // Get a specific user
  async get(id) {
    return await User.findById(id).
    populate('cars').
    populate('contact').
    populate('address.cars').
    populate('address.contact');
  }

  // Update a user
  async put(id, user) {
    return await User.findByIdAndUpdate(id, user, {new: true}, (err, updatedUser) => {
      if (err) return err;
      else return updatedUser;
    });
  }

  // Delete one to many users
  async delete(ids) {
    await this.deleteNestedData(await User.find({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}}));
    return await User.deleteMany({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}});
  }

  // Helper function for posted nested reference objects/arrays
  async deleteNestedData(users) {
    let unnest = async (users, path, service) => { for (let i = 0; i < users.length; i++) await service.delete(_.get(users[i], path)); }
    await unnest(users, ['cars'], this.carService);
    await unnest(users, ['contact'], this.contactService);
    await unnest(users, ['address', 'cars'], this.carService);
    await unnest(users, ['address', 'contact'], this.contactService);
    return users;
  }
}

module.exports = UserService;
