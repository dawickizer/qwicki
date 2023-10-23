import { User } from '../user/user.model';

export class Message {
  _id?: string;
  createdAt: Date;
  from: User;
  to: User;
  content: string;
  viewed: boolean;
}
