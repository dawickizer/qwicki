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
  username: { type: String, lowercase: true, unique: true, default: null },
  usernameRaw: { type: String, unique: true, default: null },
  password: { type: String, default: null },
  role: { type: String, default: 'user' },
  email: { type: String, unique: true, default: null },
  firstName: { type: String, default: null },
  middleName: { type: String, default: null },
  lastName: { type: String, default: null }
});

let handleE11000 = (error: any, doc: any, next: any) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    const entries = Object.entries(error.keyValue);
    next(new Error(`The ${entries[0][0]}: '${entries[0][1]}' is already taken`));
  } else {
    next();
  }
};

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
