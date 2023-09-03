import { User } from '../user/user';

export class Group {
  _id?: string;
  name: string;
  createdAt: Date;
  createdBy: User;
  members: User[];
}
