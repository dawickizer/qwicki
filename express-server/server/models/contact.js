var mongoose = require('mongoose');

// create mongoose schema
const ContactSchema = new mongoose.Schema({
  email: String,
  phone: String
});

// create mongoose model
const Contact = mongoose.model('Contact', ContactSchema);

module.exports = {
  Contact: Contact,
  ContactSchema: ContactSchema
}

// var Contact = require('../models/contact').Contact;
//Now you can do Contact.find, Contact.update, etc
