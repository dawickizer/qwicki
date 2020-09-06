// Import dependencies
const mongoose = require('mongoose');
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
    populate('contact');
  }

  // Post one to many users. If an object is passed in it will be converted to
  // an array of size one. Returns an array of users
  async post(users) {

    // handle if users is a single object being posted
    if (!Array.isArray(users)) {
      let temp = users;
      users = [];
      users.push(temp);
    }
    return await User.insertMany(await this.postNestedData(users));
  }

  // Helper function for posted nested reference objects/arrays
  async postNestedData(users) {
      // await this.postNestedArray(users, ['cars'], this.carService);
      // await this.postNestedObject(users, 'contact', this.contactService);
      await this.postNestedArray(users, ['address', 'cars'], this.carService);
      return users;
  }

  // Helper function for posting nested reference arrays
  async postNestedArray(users, path, service) {
      // const get = (path, object) => path.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, object); // nested path by string
      //
      // console.log(get(path, users[0]));

      const array1 = [1, 2, 3, 4];
      const reducer = (accumulator, currentValue) => {
        console.log('Accumulator: ' + accumulator);
        console.log('Current Value: ' + currentValue);
        return accumulator + currentValue;
      }

      // 1 + 2 + 3 + 4
      console.log(array1.reduce(reducer));
      // expected output: 10

      // 5 + 1 + 2 + 3 + 4
      console.log(array1.reduce(reducer, 5));
      // expected output: 15

      // let temp = [];
      // for (let i = 0; i < users.length; i++) {
      //   //if (get([i, ...path], users) == undefined || get([i, ...path], users) == null) users[i][path] = [];
      //   for (let k = 0; k < get([i, ...path], users).length; k++) temp.push(get([i, ...path], users)[k]);
      //
      //   //users[i][path] = await service.post(temp);
      //   temp = [];
      // }
      // return users;
  }

  // Helper function for posting nested reference arrays
  // async postNestedArray(users, path, service) {
  //
  //     let temp = [];
  //     for (let i = 0; i < users.length; i++) {
  //       eval('if (users[i].' + path + ' == undefined || users[i].' + path + ' == null) users[i].' + path + ' = [];');
  //       console.log(eval('users[i].' + path));
  //       eval('for (let k = 0; k < users[i].' + path + '.length; k++) temp.push(users[i].' + path + '[k]);');
  //       eval('async () => users[i]. ' + path + ' = await service.post(temp);');
  //       temp = [];
  //     }
  //     return users;
  // }

  // // Helper function for posting nested reference arrays
  // async postNestedArray(users, path, service) {
  //     let temp = [];
  //     for (let i = 0; i < users.length; i++) {
  //       if (users[i][path] == undefined || users[i][path] == null) users[i][path] = [];
  //       for (let k = 0; k < users[i][path].length; k++) temp.push(users[i][path][k]);
  //       users[i][path] = await service.post(temp);
  //       temp = [];
  //     }
  //     return users;
  // }


  // Helper function for posting nested reference objects
  async postNestedObject(users, objectName, service) {
      for (let i = 0; i < users.length; i++) {
        if (users[i][objectName] != undefined) {
          let result = await service.post(users[i][objectName]);
          users[i][objectName] = result[0]; // data is returned as an array
        }
      }
      return users;
  }

  // Get a specific user
  async get(id) {
    return await User.findById(id).
    populate('cars').
    populate('contact');
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
