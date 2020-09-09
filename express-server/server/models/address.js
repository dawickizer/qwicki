var mongoose = require('mongoose');
const DogSchema = require('./dog').DogSchema;
const ContactSchema = require('./contact').ContactSchema;

// create mongoose schema
const AddressSchema = new mongoose.Schema({
  primaryAddress: { type: String, default: null },
  secondaryAddress: { type: String, default: null },
  city: { type: String, default: null },
  state: { type: String, default: null },
  zip: { type: String, default: null },
  country: { type: String, default: null },
  cars: [{ type: mongoose.Schema.Types.ObjectId, default: [], ref: 'Car' }],
  dogs: [DogSchema],
  contact: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'Contact' },
  contactEmbedded: { type: ContactSchema, default: null }
});

// create mongoose model
const Address = mongoose.model('Address', AddressSchema);

module.exports = {
  Address: Address,
  AddressSchema: AddressSchema
}

// var Address = require('../models/address').Address;
//Now you can do Address.find, Address.update, etc
