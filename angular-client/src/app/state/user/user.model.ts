import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { Friend } from '../friend/friend.model';
import { OnlineStatus } from 'src/app/models/online-status/online-status';

export class User {
  _id?: string;
  username: string;
  password: string;
  role?: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  onlineStatus?: OnlineStatus = 'offline';
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
      this.onlineStatus = user.onlineStatus ?? 'offline';
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
    return this.friends.filter(friend => friend.onlineStatus === 'online');
  }

  get offlineFriends(): Friend[] {
    return this.friends.filter(friend => friend.onlineStatus === 'offline');
  }

  get awayFriends(): Friend[] {
    return this.friends.filter(friend => friend.onlineStatus === 'away');
  }
}
