var mongoose = require('mongoose');
const DogSchema = require('./dog').DogSchema;

// create mongoose schema
const ContactSchema = new mongoose.Schema({
  email: { type: String, default: null },
  phone: { type: String, default: null },
  dogs: [{ type: mongoose.Schema.Types.ObjectId, default: [], ref: 'Dog' }],
  dog: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'Dog' },
  dogsEmbedded: [DogSchema],
  dogEmbedded: { type: DogSchema, default: null }
});

// create mongoose model
const Contact = mongoose.model('Contact', ContactSchema);

module.exports = {
  Contact: Contact,
  ContactSchema: ContactSchema
}

// var Contact = require('../models/contact').Contact;
//Now you can do Contact.find, Contact.update, etc
