import { Schema, model, Document } from 'mongoose';

interface Message extends Document {
  createdAt: Date;
  updatedAt: Date;
  from: Schema.Types.ObjectId;
  to: Schema.Types.ObjectId;
  content: string;
  viewed: boolean;
}

// create mongoose schema
const MessageSchema = new Schema<Message>(
  {
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String },
    viewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// create mongoose model
const Message = model<Message>('Message', MessageSchema);

export { Message, MessageSchema };
