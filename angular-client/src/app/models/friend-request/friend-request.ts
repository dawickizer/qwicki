import { User } from '../user/user';

export class FriendRequest {
  _id?: string;
  createdAt: Date;
  from: User;
  to: User;
  accepted: boolean;
}
