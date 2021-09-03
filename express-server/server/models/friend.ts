import { Schema, model, Document } from 'mongoose';
interface Friend extends Document {
    username: string;
}

// create mongoose schema
const FriendSchema = new Schema<Friend>({
    username: { type: String },
});

// create mongoose model
const Friend = model<Friend>('Friend', FriendSchema);

export {
  Friend,
  FriendSchema
}
