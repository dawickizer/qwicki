var mongoose = require('mongoose');
const AddressSchema = require('./address').AddressSchema;
const DogSchema = require('./dog').DogSchema;

// create mongoose schema
const UserSchema = new mongoose.Schema({
  name: { type: String, default: null },
  age: { type: Number, default: null },
  cars: [{ type: mongoose.Schema.Types.ObjectId, default: [], ref: 'Car' }],
  dogs: [DogSchema],
  contact: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'Contact' },
  address: { type: AddressSchema, default: null }
});

// create mongoose model
const User = mongoose.model('User', UserSchema);

module.exports = {
  User: User,
  UserSchema: UserSchema
}

// var User = require('../models/user').User;
//Now you can do User.find, User.update, etc
