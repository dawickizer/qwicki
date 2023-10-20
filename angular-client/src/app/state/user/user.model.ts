import { FriendRequest } from 'src/app/models/friend-request/friend-request';
import { Friend } from '../friend/friend.model';

export class User {
  _id?: string;
  username: string;
  password: string;
  role?: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  online = false;
  friends: Friend[] = [];
  inboundFriendRequests: FriendRequest[] = [];
  outboundFriendRequests: FriendRequest[] = [];

  constructor(user?: Partial<User>) {
    if (user) {
      this._id = user._id;
      this.username = user.username;
      this.password = user.password;
      this.role = user.role;
      this.email = user.email;
      this.firstName = user.firstName;
      this.middleName = user.middleName;
      this.lastName = user.lastName;
      this.online = user.online ?? false;
      this.friends = user.friends.map(friend => new Friend(friend));
      this.inboundFriendRequests = user.inboundFriendRequests.map(
        inboundFriendRequest => new FriendRequest(inboundFriendRequest)
      );
      this.outboundFriendRequests = user.outboundFriendRequests.map(
        outboundFriendRequest => new FriendRequest(outboundFriendRequest)
      );
    }
  }

  get onlineFriends(): Friend[] {
    return this.friends.filter(friend => friend.online);
  }

  get offlineFriends(): Friend[] {
    return this.friends.filter(friend => !friend.online);
  }
}
