import { Schema, model } from 'mongoose';
import { AddressSchema } from './address';
import { DogSchema } from './dog';

// create mongoose schema
const UserSchema = new Schema({
  name: { type: String, default: null },
  age: { type: Number, default: null },
  cars: [{ type: Schema.Types.ObjectId, default: [], ref: 'Car' }],
  dogs: [DogSchema],
  contact: { type: Schema.Types.ObjectId, default: null, ref: 'Contact' },
  address: { type: AddressSchema, default: null }
});

// create mongoose model
const User = model('User', UserSchema);

export {
  User,
  UserSchema
}
