// Import dependencies
const mongoose = require('mongoose');

// MongoDB URL from the docker-compose file
const dbHost = 'mongodb://database/mean';

// Connect to mongodb
mongoose.connect(dbHost);

// create mongoose model
const User = require('../models/user').User;
const Car = require('../models/car').Car;
const Address = require('../models/address').Address;

class UserService {

  getAll() {
    return 'get all';
  }

  post() {
    return 'post';
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
