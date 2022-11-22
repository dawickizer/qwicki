import { Schema, model, Document } from 'mongoose';

interface Message extends Document {
    createdAt: Date;
    from: Schema.Types.ObjectId;
    to: Schema.Types.ObjectId;
    content: String;
}

// create mongoose schema
const MessageSchema = new Schema<Message>({
    createdAt: { type: Date },
    from: { type: Schema.Types.ObjectId, default: null, ref: 'User' },
    to: { type: Schema.Types.ObjectId, default: null, ref: 'User' },
    content: { type: String }
  });

// create mongoose model
const Message = model<Message>('Message', MessageSchema);

export {
  Message,
  MessageSchema
}
