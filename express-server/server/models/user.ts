import { Schema, model, Document } from 'mongoose';
import {
  handleE11000,
  handleRequiredField,
} from '../middleware/error.middleware';

interface User extends Document {
  createdAt: Date;
  updatedAt: Date;
  username: string;
  usernameLower: string;
  password: string;
  role: string;
  email: string;
  emailLower: string;
  firstName: string;
  middleName: string;
  lastName: string;
  friends: Schema.Types.ObjectId[];
  inboundFriendRequests: Schema.Types.ObjectId[];
  outboundFriendRequests: Schema.Types.ObjectId[];
  inboundInvites: Schema.Types.ObjectId[];
  outboundInvites: Schema.Types.ObjectId[];
}

// create mongoose schema
const UserSchema = new Schema<User>(
  {
    username: { type: String, unique: true, required: true },
    usernameLower: { type: String, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    email: { type: String, unique: true, default: null },
    emailLower: { type: String, unique: true, lowercase: true },
    firstName: { type: String, default: null },
    middleName: { type: String, default: null },
    lastName: { type: String, default: null },
    friends: [{ type: Schema.Types.ObjectId, default: [], ref: 'User' }],
    inboundFriendRequests: [
      { type: Schema.Types.ObjectId, default: [], ref: 'FriendRequest' },
    ],
    outboundFriendRequests: [
      { type: Schema.Types.ObjectId, default: [], ref: 'FriendRequest' },
    ],
    inboundInvites: [
      { type: Schema.Types.ObjectId, default: [], ref: 'Invite' },
    ],
    outboundInvites: [
      { type: Schema.Types.ObjectId, default: [], ref: 'Invite' },
    ],
  },
  { timestamps: true }
);

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

export { User, UserSchema };
