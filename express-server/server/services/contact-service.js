// Import dependencies
const mongoose = require('mongoose');
const db = require('../config/db');
const Contact = require('../models/contact').Contact;

// Connect to mongodb
mongoose.connect(db);

class ContactService {

  async getAll() {
    return await Contact.find({}, (err, contacts) => {
        if (err) return err;
        else return contacts;
    });
  }

  async post(body) {
    return await Contact.insertMany(body);
  }

  async get(id) {
    return await Contact.findById(id, (err, contact) => {
        if (err) return err;
        else return contact;
    });
  }

  async put(id, body) {
    return await Contact.findByIdAndUpdate(id, body, {new: true}, (err, contact) => {
        if (err) return err;
        else return contact;
    });
  }

  async delete(ids) {
    return await Contact.deleteMany({_id: {$in: ids}}, (err, result) => {
        if (err) return err;
        else return result;
    });
  }
}

module.exports = ContactService;
