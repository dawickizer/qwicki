var mongoose = require('mongoose');

// create mongoose schema
const DogSchema = new mongoose.Schema({
  name: String,
  breed: String  
});

// create mongoose model
const Dog = mongoose.model('Dog', DogSchema);

module.exports = {
  Dog: Dog,
  DogSchema: DogSchema
}

// var Dog = require('../models/dog').Dog;
//Now you can do Dog.find, Dog.update, etc
