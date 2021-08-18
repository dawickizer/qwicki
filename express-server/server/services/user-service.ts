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
  async getByLoginCredentials(loginCredentials: any): Promise<User | null> {
    return await User.findOne({username: loginCredentials.username, password: loginCredentials.password});
  }

  // GET a user by username (case insensitve) - CHECK USER SCHEMA to see why
  async getByUsername(username: string): Promise<User | null> {
    return await User.findOne({username: username,});
  }

  // GET a users by usernames (case insensitve) - CHECK USER SCHEMA to see why
  async getByUsernames(usernames: string[]): Promise<User[]> {
    return await User.find({username: {$in: usernames}});
  }

  // POST one user
  async post(user: User): Promise<User> {
    return await User.create(user);
  }

  // POST many users.
  async postMany(users: User[]): Promise<User[]> {
    return await User.insertMany(users);
  }

  // PUT a user
  async put(id: string, updatedUser: User): Promise<User | null> {
    return null;
  }

  // DELETE one to many users
  async delete(ids: string[]): Promise<any> {
    return await User.deleteMany({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}});
  }
}

export default UserService;
