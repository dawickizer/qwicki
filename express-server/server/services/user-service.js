// Import dependencies
const mongoose = require('mongoose');
const User = require('../models/user').User;
const Car = require('../models/car').Car;
const Address = require('../models/address').Address;

// MongoDB URL from the docker-compose file
const dbHost = 'mongodb://database/mean';

// Connect to mongodb
mongoose.connect(dbHost);

class UserService {

  getAll() {
    return 'get all';
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

  get() {
    return 'get';
  }

  put() {
    return 'put';
  }

  delete() {
    return 'delete';
  }

}

module.exports = UserService;
