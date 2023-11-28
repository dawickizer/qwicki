import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { Friend } from '../friend/friend.model';
import { Invite } from '../invite/invite.model';
import { Status } from 'src/app/models/status/status.model';

export class User {
  _id?: string;
  username: string;
  password: string;
  role?: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  status?: Status = new Status();
  friends: Friend[] = [];
  inboundFriendRequests: FriendRequest[] = [];
  outboundFriendRequests: FriendRequest[] = [];
  inboundInvites: Invite[] = [];
  outboundInvites: Invite[] = [];

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
      this.status = user.status ?? new Status();
      this.friends = user.friends.map(friend => new Friend(friend));
      this.inboundFriendRequests = user.inboundFriendRequests.map(
        inboundFriendRequest => new FriendRequest(inboundFriendRequest)
      );
      this.outboundFriendRequests = user.outboundFriendRequests.map(
        outboundFriendRequest => new FriendRequest(outboundFriendRequest)
      );
      this.inboundInvites = user.inboundInvites.map(
        inboundInvite => new Invite(inboundInvite)
      );
      this.outboundInvites = user.outboundInvites.map(
        outboundInvite => new Invite(outboundInvite)
      );
    }
  }

  get onlineFriends(): Friend[] {
    return this.friends.filter(friend => friend.status.presence === 'Online');
  }

  get offlineFriends(): Friend[] {
    return this.friends.filter(friend => friend.status.presence === 'Offline');
  }

  get awayFriends(): Friend[] {
    return this.friends.filter(friend => friend.status.presence === 'Away');
  }
}
