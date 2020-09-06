// Import dependencies
const mongoose = require('mongoose');
const db = require('../config/db');
const User = require('../models/user').User;
const Car = require('../models/car').Car;
const CarService = require('../services/car-service');
const ContactService = require('../services/contact-service');

// Connect to mongodb
mongoose.connect(db);

class UserService {

  // create CreateService
  carService = new CarService();
  contactService = new ContactService();

  async getAll() {
    return await User.find({}, (err, users) => {
        if (err) return err;
        else return users;
    });
  }

  async post(users) {
    return await User.insertMany(await this.postNestedData(users));

    // MAYBE modify users if data is object vs array
  }

  async postNestedData(users) {
      await this.postNestedArray(users, 'cars', this.carService);
      await this.postNestedObject(users, 'contact', this.contactService);
      return users;
  }

  async postNestedArray(users, arrayName, service) {
      let temp = [];
      for (let i = 0; i < users.length; i++) {
        if (users[i][arrayName] == undefined || users[i][arrayName] == null) users[i][arrayName] = [];
        for (let k = 0; k < users[i][arrayName].length; k++) temp.push(users[i][arrayName][k]);
        users[i][arrayName] = await service.post(temp);
        temp = [];
      }
      return users;
  }

  async postNestedObject(users, objectName, service) {
      for (let i = 0; i < users.length; i++) {
        if (users[i][objectName] != undefined) {
          let result = await service.post([users[i][objectName]]);
          users[i][objectName] = result[0];
        }
      }
      return users;
  }

  async get(id) {
    return await User.findById(id, (err, user) => {
        if (err) return err;
        else return user;
    });
  }

  async put(id, user) {
    return await User.findByIdAndUpdate(id, user, {new: true}, (err, updatedUser) => {
        if (err) return err;
        else return updatedUser;
    });
  }

  async delete(ids) {
    return await User.deleteMany({_id: {$in: ids}}, (err, result) => {
        if (err) return err;
        else return result;
    });
  }

}

module.exports = UserService;
