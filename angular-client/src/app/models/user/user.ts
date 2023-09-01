import { FriendRequest } from '../friend-request/friend-request';

export class User {
  _id?: string;
  username: string;
  password: string;
  role?: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  online: boolean;
  friends: User[] = [];
  inboundFriendRequests: FriendRequest[] = [];
  outboundFriendRequests: FriendRequest[] = [];

  constructor(user?: User) {
    if (user) {
      this._id = user._id;
      this.username = user.username;
      this.password = user.password;
      this.role = user.role;
      this.email = user.email;
      this.firstName = user.firstName;
      this.middleName = user.middleName;
      this.lastName = user.lastName;
      this.online = user.online;
      this.friends = user.friends;
      this.inboundFriendRequests = user.inboundFriendRequests;
      this.outboundFriendRequests = user.outboundFriendRequests;
    }
  }

  get onlineFriends(): User[] {
    return this.friends.filter(friend => friend.online);
  }

  get offlineFriends(): User[] {
    return this.friends.filter(friend => !friend.online);
  }
}
