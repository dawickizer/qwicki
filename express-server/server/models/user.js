var mongoose = require('mongoose');
const CarSchema = require('./car').CarSchema;
const AddressSchema = require('./address').AddressSchema;

// create mongoose schema
const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  cars: [CarSchema],
  address: AddressSchema
});

// create mongoose model
const User = mongoose.model('User', UserSchema);

module.exports = {
  User: User,
  UserSchema: UserSchema
}

// var User = require('../models/user').User;
//Now you can do User.find, User.update, etc
