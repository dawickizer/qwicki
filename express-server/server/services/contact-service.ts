// Import dependencies (node_modules)
import { connect } from 'mongoose';
import { set, get as _get } from 'lodash';

// Import dependencies (module.exports)
import config from '../config/config';
import { Contact } from '../models/contact';
import DogService from '../services/dog-service';

// determine environment 
const env = process.env.NODE_ENV || 'development';

// Connect to mongodb
connect(config[env].db);

// This class is responsible for handling the database operations for Contacts and
// its nested fields. Basic CRUD operations are supported as well as the CRUD
// operations for embedded and referenced fields (nested objects and arrays supported)
class ContactService {

  // create services for nested data
  dogService = new DogService();

  // Returns all the contacts
  async getAll() {
    return await Contact.find({}).
    populate('dogs').
    populate('dog');
  }

  // Get a specific contact
  async get(id: any) {
    return await Contact.findById(id).
    populate('dogs').
    populate('dog');
  }

  // Post one to many contacts. If an object is passed in it will be converted to
  // an array of size one. Returns an array of contacts
  async post(contacts: any[]) {
    return (!Array.isArray(contacts)) ? (await Contact.insertMany(await this.postNestedData([contacts])))[0]
                                      : await Contact.insertMany(await this.postNestedData(contacts));
  }

  // Helper function for posted nested reference objects/arrays
  async postNestedData(contacts: any[]) {
    let nest = async (contacts: any[], path: any, service: any) => { for (let i = 0; i < contacts.length; i++) set(contacts[i], path, (_get(contacts[i], path) ? await service.post(_get(contacts[i], path)) : undefined)); }
    await nest(contacts, ['dogs'], this.dogService);
    await nest(contacts, ['dog'], this.dogService);
    return contacts;
  }

  // Update a contact
  async put(id: any, contact: any) {
    console.log("HELLO");

    return await Contact.findByIdAndUpdate(id, contact, {new: true}, (err, updatedContact) => {
        if (err) return err;
        else return updatedContact;
    });
  }

  // Delete one to many contacts
  async delete(ids: any[]) {
    await this.deleteNestedData(await Contact.find({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}}));
    return await Contact.deleteMany({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}});
  }

  // Helper function for posted nested reference objects/arrays
  async deleteNestedData(contacts: any[]) {
    let unnest = async (contacts: any[], path: any, service: any) => { for (let i = 0; i < contacts.length; i++) await service.delete(_get(contacts[i], path)); }
    await unnest(contacts, ['dogs'], this.dogService);
    await unnest(contacts, ['dog'], this.dogService);
    return contacts;
  }
}

export default ContactService;
