import { Schema, model, Document } from 'mongoose';
import { handleE11000, handleRequiredField } from '../middleware/error';
import { FriendRequest, FriendRequestSchema } from './friend-request';
interface User extends Document {
  username: String;
  usernameLower: String;
  password: String;
  role: String,
  email: String;
  firstName: String;
  middleName: String;
  lastName: String;
  online: Boolean;
  friends: Schema.Types.ObjectId[];
  inboundFriendRequests: Schema.Types.ObjectId[];
  outboundFriendRequests: Schema.Types.ObjectId[];
}

// create mongoose schema
const UserSchema = new Schema<User>({
  username: { type: String, unique: true, required: true },
  usernameLower: { type: String, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  email: { type: String, unique: true, default: null },
  firstName: { type: String, default: null },
  middleName: { type: String, default: null },
  lastName: { type: String, default: null },
  online: { type: Boolean, default: false },
  friends: [{ type: Schema.Types.ObjectId, default: [], ref: 'User' }],
  inboundFriendRequests: [{ type: Schema.Types.ObjectId, default: [], ref: 'FriendRequest' }],
  outboundFriendRequests: [{ type: Schema.Types.ObjectId, default: [], ref: 'FriendRequest' }],
});

UserSchema.post('save', handleE11000);
UserSchema.post('update', handleE11000);
UserSchema.post('findOneAndUpdate', handleE11000);
UserSchema.post('insertMany', handleE11000);

UserSchema.post('save', handleRequiredField);
UserSchema.post('update', handleRequiredField);
UserSchema.post('findOneAndUpdate', handleRequiredField);
UserSchema.post('insertMany', handleRequiredField);

// create mongoose model
const User = model<User>('User', UserSchema);

export {
  User,
  UserSchema
}
