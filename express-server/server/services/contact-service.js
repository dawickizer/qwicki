// Import dependencies
const mongoose = require('mongoose');
const db = require('../config/db');
const Contact = require('../models/contact').Contact;

// Connect to mongodb
mongoose.connect(db);

// This class is responsible for handling the database operations for Contacts and
// its nested fields. Basic CRUD operations are supported as well as the CRUD
// operations for embedded and referenced fields (nested objects and arrays supported)
class ContactService {

  // Returns all the contacts
  async getAll() {
    return await Contact.find({});
  }

  // Post one to many contacts. If an object is passed in it will be converted to
  // an array of size one. Returns an array of contacts
  async post(contacts) {

    // handle if contacts is a single object being posted
    if (!Array.isArray(contacts)) return (await Contact.insertMany(await this.postNestedData([contacts])))[0];
    else return await Contact.insertMany(await this.postNestedData(contacts));
  }

  // Helper function for posted nested reference objects/arrays
  async postNestedData(contacts) {
      return contacts;
  }

  // Helper function for posting nested reference arrays
  async postNestedArray(contacts, arrayName, service) {
      let temp = [];
      for (let i = 0; i < contacts.length; i++) {
        if (contacts[i][arrayName] == undefined || contacts[i][arrayName] == null) contacts[i][arrayName] = [];
        for (let k = 0; k < contacts[i][arrayName].length; k++) temp.push(contacts[i][arrayName][k]);
        contacts[i][arrayName] = await service.post(temp);
        temp = [];
      }
      return contacts;
  }

  // Helper function for posting nested reference objects
  async postNestedObject(contacts, objectName, service) {
      for (let i = 0; i < contacts.length; i++) {
        if (contacts[i][objectName] != undefined) {
          let result = await service.post(contacts[i][objectName]);
          contacts[i][objectName] = result[0]; // data is returned as an array
        }
      }
      return contacts;
  }

  // Get a specific contact
  async get(id) {
    return await Contact.findById(id);
  }

  // Update a contact
  async put(id, contact) {
    return await Contact.findByIdAndUpdate(id, contact, {new: true}, (err, updatedContact) => {
        if (err) return err;
        else return updatedContact;
    });
  }

  // Delete one to many contacts
  async delete(ids) {
    if (!Array.isArray(ids)) {
      await this.deleteNestedData(await Contact.find({_id: {$in: [ids]}}));
      return await Contact.deleteMany({_id: {$in: [ids]}});
    }
    else {
      await this.deleteNestedData(await Contact.find({_id: {$in: ids}}));
      return await Contact.deleteMany({_id: {$in: ids}});
    }
  }

  async deleteNestedData(contacts) {
      return contacts;
  }

  async deleteNestedArray(contacts, arrayName, service) {
      let temp = [];
      for (let i = 0; i < contacts.length; i++)
        for (let k = 0; k < contacts[i][arrayName].length; k++) temp.push(contacts[i][arrayName][k]);
      return await service.delete(temp);
  }

  async deleteNestedObject(contacts, objectName, service) {
      let temp = [];
      for (let i = 0; i < contacts.length; i++)
        if (contacts[i][objectName] != undefined)
          temp.push(contacts[i][objectName]);
      return await service.delete(temp);
  }
}

module.exports = ContactService;
