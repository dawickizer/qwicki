// Import dependencies (node_modules)
const mongoose = require('mongoose');
const _ = require('lodash');

// Import dependencies (module.exports)
const db = require('../config/db');
const User = require('../models/user').User;
const Car = require('../models/car').Car;
const Address = require('../models/address').Address;
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
  // an array of size one. Returns an array of users
  async post(users) {

    // handle if users is a single object being posted
    if (!Array.isArray(users)) return (await User.insertMany(await this.postNestedData([users])))[0];
    else return await User.insertMany(await this.postNestedData(users));
  }

  // Helper function for posted nested reference objects/arrays
  async postNestedData(users) {
    await this.nest(users, ['cars'], this.carService);
    await this.nest(users, ['contact'], this.contactService);
    await this.nest(users, ['address', 'cars'], this.carService);
    await this.nest(users, ['address', 'contact'], this.contactService);
    return users;
  }

  // Helper function for posting nested reference arrays
  async nest(users, path, service) {
    for (let i = 0; i < users.length; i++) _.set(users[i], path, (_.get(users[i], path) ? await service.post(_.get(users[i], path)) : undefined));
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
    await this.deleteNestedData(await User.find({_id: {$in: ids}}));
    return await User.deleteMany({_id: {$in: ids}});
  }

  async deleteNestedData(users) {
    await this.deleteNestedArray(users, 'cars', this.carService);
    await this.deleteNestedObject(users, 'contact', this.contactService);
    return users;
  }

  async deleteNestedArray(users, arrayName, service) {
    let temp = [];
    for (let i = 0; i < users.length; i++)
      for (let k = 0; k < users[i][arrayName].length; k++) temp.push(users[i][arrayName][k]);
    return await service.delete(temp);
  }

  async deleteNestedObject(users, objectName, service) {
    let temp = [];
    for (let i = 0; i < users.length; i++)
      if (users[i][objectName] != undefined)
        temp.push(users[i][objectName]);
    return await service.delete(temp);
  }
}

module.exports = UserService;