import { Schema, model, Document } from 'mongoose';
import { handleE11000 } from '../middleware/error';
interface Friend extends Document {
    username: string;
    usernameRaw?: string;
}

// create mongoose schema
const FriendSchema = new Schema<Friend>({
    username: { type: String, lowercase: true, unique: true, default: null },
    usernameRaw: { type: String, unique: true, default: null }
  });

// create mongoose model
const Friend = model<Friend>('Friend', FriendSchema);

export {
  Friend,
  FriendSchema
}
