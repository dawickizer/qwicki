// Import dependencies (node_modules)
import { connect } from 'mongoose';

// Import dependencies (module.exports)
import config from '../config/config';
import { User } from '../models/user';

// determine environment 
const env = process.env.NODE_ENV || 'development';

// Connect to mongodb
connect(config[env].db);

// This class is responsible for handling the CRUD database operations for Users 
class UserService {

  // GET all the users
  async getAll(): Promise<User[] | null> {
    return await User.find({});
  }

  // GET a user by id
  async get(id: string): Promise<User | null> {
    return await User.findById(id);
  }

  // GET a user by username (case insensitve) AND password (case sensitive) - CHECK USER SCHEMA to see why
  async getByCredentials(credentials: any): Promise<User | null> {
    return await User.findOne({username: credentials.username, password: credentials.password});
  }

  // POST one user
  async post(user: User): Promise<User> {
    user.usernameRaw = user.username; // preserve original username before it gets converted to lowercase in DB
    return await User.create(user);
  }

  // POST many users.
  async postMany(users: User[]): Promise<User[]> {
    // preserve original username before it gets converted to lowercase in DB
    return await User.insertMany(users.map(user => ({...user, usernameRaw: user.username})));
  }

  // PUT a user
  async put(id: string, user: User): Promise<User | null> {
    user.usernameRaw = user.username; // preserve original username before it gets converted to lowercase in DB
    return await User.findOneAndUpdate({_id: id}, user, {new: true});
  }

  // DELETE many users
  async deleteMany(ids: string[]): Promise<any> {
    return await User.deleteMany({_id: {$in: ids}});
  }

  // DELETE one user
  async delete(id: string[]): Promise<any> {
    return await User.deleteOne({_id: id});
  }
}

export default UserService;
