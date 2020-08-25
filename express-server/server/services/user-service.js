// Import dependencies
const mongoose = require('mongoose');
const db = require('../config/db');
const User = require('../models/user').User;
const Car = require('../models/car').Car;
const Address = require('../models/address').Address;

// Connect to mongodb
mongoose.connect(db);

class UserService {

  async getAll() {
    return await User.find({}, (err, users) => {
        if (err) return err;
        else return users;
    });
  }

  async post(body) {

    let user = new User({
        name: body.name,
        age: body.age,
        cars: body.cars,
        address: body.address
    });

    return await user.save();
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

  async delete(id) {
    return await User.deleteOne({_id: id}, (err, result) => {
        if (err) return err;
        else return result;
    });
  }
}

module.exports = UserService;
