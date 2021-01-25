import { Schema, model } from 'mongoose';

// create mongoose schema
const DogSchema = new Schema({
  name: { type: String, default: null },
  breed: { type: String, default: null }  
});

// create mongoose model
const Dog = model('Dog', DogSchema);

export {
  Dog,
  DogSchema
}
