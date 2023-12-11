import { Friend } from 'src/app/state/friend/friend.model';

export class Notification {
  _id?: string;
  createdAt: Date;
  updatedAt: Date;
  from: Friend;
  to: Friend;
  type: string;
}
