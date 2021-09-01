import { Schema, model, Document } from 'mongoose';
import { handleE11000 } from '../middleware/error';
import { FriendSchema } from './friend';
import { FriendRequest, FriendRequestSchema } from './friend-request';
interface User extends Document {
  username: String;
  usernameRaw: String;
  password: String;
  role: String,
  email: String;
  firstName: String;
  middleName: String;
  lastName: String;
  friends: User[];
  inboundFriendRequests: FriendRequest[];
  outboundFriendRequests: FriendRequest[];
}

// create mongoose schema
const UserSchema = new Schema<User>({
  username: { type: String, lowercase: true, unique: true, default: null },
  usernameRaw: { type: String, unique: true, default: null },
  password: { type: String, default: null },
  role: { type: String, default: 'user' },
  email: { type: String, unique: true, default: null },
  firstName: { type: String, default: null },
  middleName: { type: String, default: null },
  lastName: { type: String, default: null },
  friends: [FriendSchema],
  inboundFriendRequests: [FriendRequestSchema],
  outboundFriendRequests: [FriendRequestSchema]
});

UserSchema.post('save', handleE11000);
UserSchema.post('update', handleE11000);
UserSchema.post('findOneAndUpdate', handleE11000);
UserSchema.post('insertMany', handleE11000);

// create mongoose model
const User = model<User>('User', UserSchema);

export {
  User,
  UserSchema
}
