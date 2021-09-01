import { Schema, model, Document } from 'mongoose';
import { Friend, FriendSchema } from './friend';

interface FriendRequest extends Document {
    createdAt: Date;
    from: Friend;
    to: Friend;
    accepted: boolean;
}

// create mongoose schema
const FriendRequestSchema = new Schema<FriendRequest>({
    createdAt: { type: Date },
    from: { type: FriendSchema },
    to: { type: FriendSchema },
    accepted: { type: Boolean }
  });

// create mongoose model
const FriendRequest = model<FriendRequest>('FriendRequest', FriendRequestSchema);

export {
  FriendRequest,
  FriendRequestSchema
}
