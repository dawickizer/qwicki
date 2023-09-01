import { Schema, model } from 'mongoose';

// create mongoose schema
const AddressSchema = new Schema({
  primaryAddress: { type: String, default: null },
  secondaryAddress: { type: String, default: null },
  city: { type: String, default: null },
  state: { type: String, default: null },
  zip: { type: String, default: null },
  country: { type: String, default: null },
});

// create mongoose model
const Address = model('Address', AddressSchema);

export { Address, AddressSchema };
