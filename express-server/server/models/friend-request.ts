import { Schema, model, Document } from 'mongoose';
import { Notification } from './notification';

interface FriendRequest extends Document, Notification {
  accepted: boolean;
  type: 'friend-request';
}

// create mongoose schema
const FriendRequestSchema = new Schema<FriendRequest>(
  {
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    accepted: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['friend-request'],
      required: true,
      default: 'friend-request',
    },
  },
  { timestamps: true }
);

// create mongoose model
const FriendRequest = model<FriendRequest>(
  'FriendRequest',
  FriendRequestSchema
);

export { FriendRequest, FriendRequestSchema };
