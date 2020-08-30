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

  async post(body) {
    return await User.insertMany(await this.postNestedData(body));
  }

  async postNestedData(body) {
      await this.postNestedArray(body, 'cars', this.carService);
      await this.postNestedObject(body, 'contact', this.contactService);
      return body;
  }

  async postNestedArray(body, arrayName, service) {
      let temp = [];
      for (let i = 0; i < body.length; i++) {
        if (body[i][arrayName] == undefined || body[i][arrayName] == null) body[i][arrayName] = [];
        for (let k = 0; k < body[i][arrayName].length; k++) temp.push(body[i][arrayName][k]);
        body[i][arrayName] = await service.post(temp);
        temp = [];
      }
      return body;
  }

  async postNestedObject(body, objectName, service) {
      for (let i = 0; i < body.length; i++) {
        if (body[i][objectName] != undefined) {
          let result = await service.post([body[i][objectName]]);
          body[i][objectName] = result[0];
        }
      }
      return body;
  }

  async get(id) {
    return await User.findById(id, (err, user) => {
        if (err) return err;
        else return user;
    });
  }

  async put(id, body) {
    return await User.findByIdAndUpdate(id, body, {new: true}, (err, user) => {
        if (err) return err;
        else return user;
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
