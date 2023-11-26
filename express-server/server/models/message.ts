import { Schema, model, Document } from 'mongoose';
import { Notification } from './notification';

interface Message extends Document, Notification {
  content: string;
  viewed: boolean;
  type: 'message';
}

// create mongoose schema
const MessageSchema = new Schema<Message>(
  {
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String },
    viewed: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['message'],
      required: true,
      default: 'message',
    },
  },
  { timestamps: true }
);

// create mongoose model
const Message = model<Message>('Message', MessageSchema);

export { Message, MessageSchema };
