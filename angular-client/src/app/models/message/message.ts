import { User } from '../user/user';

export class Message {
  _id?: string;
  createdAt: Date;
  from: User;
  to: User;
  content: string;
  viewed: boolean;
}
