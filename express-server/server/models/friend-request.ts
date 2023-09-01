import { Schema, model, Document } from 'mongoose';

interface FriendRequest extends Document {
  createdAt: Date;
  from: Schema.Types.ObjectId;
  to: Schema.Types.ObjectId;
  accepted: boolean;
}

// create mongoose schema
const FriendRequestSchema = new Schema<FriendRequest>({
  createdAt: { type: Date },
  from: { type: Schema.Types.ObjectId, default: null, ref: 'User' },
  to: { type: Schema.Types.ObjectId, default: null, ref: 'User' },
  accepted: { type: Boolean },
});

// create mongoose model
const FriendRequest = model<FriendRequest>(
  'FriendRequest',
  FriendRequestSchema
);

export { FriendRequest, FriendRequestSchema };
