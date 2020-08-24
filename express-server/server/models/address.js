var mongoose = require('mongoose');

// create mongoose schema
const AddressSchema = new mongoose.Schema({
  primaryAddress: String,
  secondaryAddress: String,
  city: String,
  state: String,
  zip: String,
  country: String
});

// create mongoose model
const Address = mongoose.model('Address', AddressSchema);

module.exports = {
  Address: Address,
  AddressSchema: AddressSchema
}

// var Address = require('../models/address').Address;
//Now you can do Address.find, Address.update, etc
