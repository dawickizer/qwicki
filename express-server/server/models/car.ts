import { Schema, model as _model } from 'mongoose';

// create mongoose schema
const CarSchema = new Schema({
  year: { type: Number, default: null },
  make: { type: String, default: null },
  model: { type: String, default: null },
  engine: { type: String, default: null }
});

// create mongoose model
const Car = _model('Car', CarSchema);

export {
  Car,
  CarSchema
}
