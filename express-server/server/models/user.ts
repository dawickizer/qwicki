import { Schema, model, Document } from 'mongoose';
interface User extends Document {
  username: String;
  usernameRaw: String;
  password: String;
  role: String,
  email: String;
  firstName: String;
  middleName: String;
  lastName: String;
}

// create mongoose schema
const UserSchema = new Schema<User>({
  username: { type: String, lowercase: true, default: null },
  usernameRaw: { type: String, default: null },
  password: { type: String, default: null },
  role: { type: String, default: 'user' },
  email: { type: String, default: null },
  firstName: { type: String, default: null },
  middleName: { type: String, default: null },
  lastName: { type: String, default: null }
});

// create mongoose model
const User = model<User>('User', UserSchema);

export {
  User,
  UserSchema
}
