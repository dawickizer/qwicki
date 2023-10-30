import { User } from 'src/app/state/user/user.model';

export class Group {
  _id?: string;
  name: string;
  createdAt: Date;
  createdBy: User;
  members: User[];
}
