import { Friend } from '../friend/friend.model';

export class Message {
  _id?: string;
  createdAt: Date;
  from: Friend;
  to: Friend;
  content: string;
  viewed: boolean;
}
