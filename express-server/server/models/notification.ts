import { Schema } from 'mongoose';

interface Notification {
  createdAt: Date;
  updatedAt: Date;
  from: Schema.Types.ObjectId;
  to: Schema.Types.ObjectId;
  type: string;
}

export { Notification };
