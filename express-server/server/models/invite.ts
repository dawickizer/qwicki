import { Schema, model, Document } from 'mongoose';

interface Invite extends Document {
  createdAt: Date;
  updatedAt: Date;
  from: Schema.Types.ObjectId;
  to: Schema.Types.ObjectId;
  accepted: boolean;
  type: 'party';
  roomId: string;
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
