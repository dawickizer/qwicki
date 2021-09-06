// Import dependencies (node_modules)
import { connect, Schema } from 'mongoose';

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

  // GET a user by id and populate its friends
  async getAndPopulateFriends(id: string): Promise<User | null> {
    return await User.findById(id).populate('friends', ['username', 'online']);
  }

  // GET a user by id and populate its friend requests
  async getAndPopulateFriendRequests(id: string): Promise<User | null> {
    return await User.findById(id)
    .populate('inboundFriendRequests')
    .populate('outboundFriendRequests');
  }

  // GET a user by id and populate children
  async getAndPopulateChildren(id: string): Promise<User | null> {
    return await User.findById(id)
    .populate('friends', 'username')
    .populate('inboundFriendRequests')
    .populate('outboundFriendRequests');
  }

  // GET a user by username (case insensitve) AND password (case sensitive)
  async getByCredentials(credentials: any): Promise<User | null> {
    return await User.findOne({usernameLower: credentials.username, password: credentials.password});
  }

  // GET a user by username (case insensitve)
  async getByUsername(username: string): Promise<User | null> {
    return await User.findOne({usernameLower: username});
  }

  // POST one user
  async post(user: User): Promise<User> {
    user.usernameLower = user.username;
    return await User.create(user);
  }

  // POST many users.
  async postMany(users: User[]): Promise<User[]> {
    return await User.insertMany(users.map(user => ({...user, usernameLower: user.username})));
  }

  // PUT a user
  async put(id: string | Schema.Types.ObjectId, user: User): Promise<User | null> {
    user.usernameLower = user.username;
    return await User.findOneAndUpdate({_id: id}, user, {new: true});
  }

  // PUT a user
  async putAndPopulateFriends(id: string | Schema.Types.ObjectId, user: User): Promise<User | null> {
    user.usernameLower = user.username;
    return await User.findOneAndUpdate({_id: id}, user, {new: true}).populate('friends', ['username', 'online']);
  }

  // PUT a user
  async putAndPopulateFriendRequests(id: string | Schema.Types.ObjectId, user: User): Promise<User | null> {
    user.usernameLower = user.username;
    return await User.findOneAndUpdate({_id: id}, user, {new: true})
    .populate('inboundFriendRequests')
    .populate('outboundFriendRequests');
  }

  // PUT a user
  async putAndPopulateChildren(id: string | Schema.Types.ObjectId, user: User): Promise<User | null> {
    user.usernameLower = user.username;
    return await User.findOneAndUpdate({_id: id}, user, {new: true})
    .populate('friends', ['username', 'online'])
    .populate('inboundFriendRequests')
    .populate('outboundFriendRequests');
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
