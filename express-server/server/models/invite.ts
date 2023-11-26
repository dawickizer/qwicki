import { Schema, model, Document } from 'mongoose';
import { Notification } from './notification';

interface Invite extends Document, Notification {
  accepted: boolean;
  roomId: string;
  type: 'party';
  metadata: any;
}

// create mongoose schema
const InviteSchema = new Schema<Invite>(
  {
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    accepted: { type: Boolean, default: false },
    type: { type: String, enum: ['party'], required: true },
    roomId: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// create mongoose model
const Invite = model<Invite>('Invite', InviteSchema);

export { Invite, InviteSchema };
