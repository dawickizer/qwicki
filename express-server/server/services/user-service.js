// Import dependencies (node_modules)
const mongoose = require('mongoose');
const _ = require('lodash');

// Import dependencies (module.exports)
const db = require('../config/db');
const User = require('../models/user').User;
const CarService = require('../services/car-service');
const ContactService = require('../services/contact-service');
const DogService = require('../services/dog-service');

// Connect to mongodb
mongoose.connect(db);

// This class is responsible for handling the database operations for Users and
// its nested fields. Basic CRUD operations are supported as well as the CRUD
// operations for embedded and referenced fields (nested objects and arrays supported)
class UserService {

  // create services for nested data
  carService = new CarService();
  contactService = new ContactService();
  dogService = new DogService();

  // Returns all the users
  async getAll() {
    return await User.find({}).
    populate('cars'). // reference
    populate([ // reference
        {
          path: 'contact',
          model: 'Contact',
          populate: [ // reference
            {
              path: 'dog',
              model: 'Dog',
            },
            {
              path: 'dogs',
              model: 'Dog',
            },
          ]
        }
    ]).
    populate('address.cars'). // embedded => reference
    populate([ // reference
        {
          path: 'address.contact',
          model: 'Contact',
          populate: [ // reference
            {
              path: 'dog',
              model: 'Dog',
            },
            {
              path: 'dogs',
              model: 'Dog',
            },
          ]
        }
    ]).
    populate('address.contactEmbedded.dog'). // embedded => embedded => reference
    populate('address.contactEmbedded.dogs'); // embedded => embedded => reference

  }

  // Get a specific user
  async get(id) {
    return await User.findById(id).
        populate('cars'). // reference
        populate([ // reference
            {
              path: 'contact',
              model: 'Contact',
    		      populate: [ // reference
                {
    		          path: 'dog',
    			        model: 'Dog',
    		        },
                {
    		          path: 'dogs',
    			        model: 'Dog',
    		        },
              ]
            }
        ]).
        populate('address.cars'). // embedded => reference
        populate([ // reference
            {
              path: 'address.contact',
              model: 'Contact',
    		      populate: [ // reference
                {
    		          path: 'dog',
    			        model: 'Dog',
    		        },
                {
    		          path: 'dogs',
    			        model: 'Dog',
    		        },
              ]
            }
        ]).
        populate('address.contactEmbedded.dog'). // embedded => embedded => reference
        populate('address.contactEmbedded.dogs'); // embedded => embedded => reference
  }

  // Post one to many users. If an object is passed in it will be converted to
  // an array of size one. Returns an array of users or a single user
  async post(users) {
    return (!Array.isArray(users)) ? (await User.insertMany(await this.postNestedData([users])))[0]
                                   : await User.insertMany(await this.postNestedData(users));
  }

  // Helper function for posted nested reference objects/arrays
  async postNestedData(users) {
    let nest = async (users, path, service) => { for (let i = 0; i < users.length; i++) _.set(users[i], path, (_.get(users[i], path) ? await service.post(_.get(users[i], path)) : undefined)); }
    await nest(users, ['cars'], this.carService);
    await nest(users, ['contact'], this.contactService);
    await nest(users, ['address', 'cars'], this.carService);
    await nest(users, ['address', 'contact'], this.contactService);
    await nest(users, ['address', 'contactEmbedded', 'dog'], this.dogService);
    await nest(users, ['address', 'contactEmbedded', 'dogs'], this.dogService);
    return users;
  }

  // Update a user
  async put(id, updatedUser) {

    // For put requests lets agree that the front end will always do a get request first,
    // modify the "got" user, and then pass that user to the put as the updated user

    // Consider what happens when an update happens with deleted reference data
    // Consider updating nested ref arrays
    // Consider ref within ref and ref within embedded

    // If i have a child ref object OR embedded object...and it then becomes null...i
    // need to delete the child ref object as well as all of its nested ref objects.
    //
    // If i have a child ref object OR embedded object that is null...but then provided a value...
    // i need to create the nested ref object as well as its nested ref objects
    //
    // If i have an array of nested or embedded objects and i make it null or empty...i need to delete
    // all nested ref data
    //
    // If I have an array of nested or embedded objects and I delete an item from the array.. i need to
    // delete all nested ref data from that item
    //
    // If I have an array of nested or embedded objects that is null/empty but then i create an array...
    // I need to add all of the nested ref data from each new item in the arrays
    //
    // If I have an array of nested or embedded objects and i add a record to the array...
    // I need to add all of the nested and ref data of that new record
    //
    // If I modify an item in the array i need to check for nested ref data in that item



    console.log('PUT: updatedUser');
    console.log(updatedUser);

    //await this.putNestedData(await this.get(id), updatedUser);

    console.log("PUTTING: USER");
    console.log(updatedUser);

    return await User.findByIdAndUpdate(id, updatedUser, {new: true}, (err, updatedUser) => {
      console.log("COMPLETE");
      console.log(updatedUser);
      if (err) return err;
      else return updatedUser;
    });
  }

  // Helper function for putting nested reference objects/arrays
  async putNestedData(oldUser, updatedUser) {

    console.log('PUT NESTED: oldUser');
    console.log(oldUser);
    console.log('PUT NESTED: updatedUser');
    console.log(updatedUser);

    let nest = async (oldUser, updatedUser, path, service) => {
      //_.set(updatedUser, path, _.get(oldUser, path) ? await service.put(_.get(oldUser, path)._id, _.get(updatedUser, path)) : await service.post(_.get(updatedUser, path)));

      let oldRef = _.get(oldUser, path); // get the old user's specified ref object
      let newRef = _.get(updatedUser, path); // get the updated user's specified ref object

      console.log('Old Ref');
      console.log(oldRef);
      console.log('New Ref');
      console.log(newRef);

      // if it exists do a PUT
      if (oldRef && oldRef != []) {
        console.log('ref exists...doing a PUT...');
        let also = await service.put(oldRef._id, newRef);
        console.log('updated: ' + also);

        console.log(_.set(updatedUser, path, also));

      } else {  // else POST
        console.log('ref does not exist...doing a POST...');
        let me = (await service.post(newRef));
        console.log('created: ' + me);

        console.log(_.set(updatedUser, path, me));
      }
    }

    await nest(oldUser, updatedUser, ['cars'], this.carService);
    await nest(oldUser, updatedUser, ['contact'], this.contactService);

    console.log('AFTER NESTED: updatedUser');
    console.log(updatedUser);


    return updatedUser;
  }

  // Delete one to many users
  async delete(ids) {
    await this.deleteNestedData(await User.find({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}}));
    return await User.deleteMany({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}});
  }

  // Helper function for posted nested reference objects/arrays
  async deleteNestedData(users) {
    let unnest = async (users, path, service) => { for (let i = 0; i < users.length; i++) await service.delete(_.get(users[i], path)); }
    await unnest(users, ['cars'], this.carService);
    await unnest(users, ['contact'], this.contactService);
    await unnest(users, ['address', 'cars'], this.carService);
    await unnest(users, ['address', 'contact'], this.contactService);
    await unnest(users, ['address', 'contactEmbedded', 'dog'], this.dogService);
    await unnest(users, ['address', 'contactEmbedded', 'dogs'], this.dogService);
    return users;
  }
}

module.exports = UserService;
