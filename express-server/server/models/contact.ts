import { Schema, model } from 'mongoose';
import { DogSchema } from './dog';

// create mongoose schema
const ContactSchema = new Schema({
  email: { type: String, default: null },
  phone: { type: String, default: null },
  dogs: [{ type: Schema.Types.ObjectId, default: [], ref: 'Dog' }],
  dog: { type: Schema.Types.ObjectId, default: null, ref: 'Dog' },
  dogsEmbedded: [DogSchema],
  dogEmbedded: { type: DogSchema, default: null }
});

// create mongoose model
const Contact = model('Contact', ContactSchema);

export {
  Contact,
  ContactSchema
}
