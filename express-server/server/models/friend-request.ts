import { Schema, model, Document } from 'mongoose';

interface FriendRequest extends Document {
  createdAt: Date;
  updatedAt: Date;
  from: Schema.Types.ObjectId;
  to: Schema.Types.ObjectId;
  accepted: boolean;
}

// create mongoose schema
const FriendRequestSchema = new Schema<FriendRequest>(
  {
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    accepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// create mongoose model
const FriendRequest = model<FriendRequest>(
  'FriendRequest',
  FriendRequestSchema
);

export { FriendRequest, FriendRequestSchema };
