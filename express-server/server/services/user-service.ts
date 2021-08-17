// Import dependencies (node_modules)
import { connect } from 'mongoose';

// Import dependencies (module.exports)
import config from '../config/config';
import { User } from '../models/user';

// determine environment 
const env = process.env.NODE_ENV || 'development';

// Connect to mongodb
connect(config[env].db);

// This class is responsible for handling the database operations for Users and
// its nested fields. Basic CRUD operations are supported as well as the CRUD
// operations for embedded and referenced fields (nested objects and arrays supported)
class UserService {

  // Returns all the users
  async getAll(): Promise<User[] | null> {
    return await User.find({});
  }

  // Get a specific user
  async get(id: string): Promise<User | null> {
    return await User.findById(id);
  }

  async getByLoginCredentials(loginCredentials: any): Promise<User | null> {
    return await User.findOne({username: loginCredentials.username, password: loginCredentials.password});
  }

  // Post one to many users. If an object is passed in it will be converted to
  // an array of size one. Returns an array of users or a single user
  async post(users: User[]): Promise<User | User[]> {
    return (!Array.isArray(users)) ? (await User.insertMany([users]))[0] : await User.insertMany(users);
  }

  // Update a user
  async put(id: string, updatedUser: User): Promise<User | null> {
    return null;
  }

  // Delete one to many users
  async delete(ids: string[]): Promise<any> {
    return await User.deleteMany({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}});
  }
}

export default UserService;
