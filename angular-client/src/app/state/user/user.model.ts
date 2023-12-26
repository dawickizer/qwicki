import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { Friend } from '../friend/friend.model';
import { Invite } from '../invite/invite.model';
import { Presence } from 'src/app/types/presence/presence.type';
import { Activity } from 'src/app/types/activity/activity.type';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap } from 'src/app/types/game-map/game-map.type';

export class User {
  _id?: string;
  username: string;
  password: string;
  role?: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  presence?: Presence = 'Offline';
  activity?: Activity;
  queueType?: QueueType;
  gameType?: GameType;
  gameMode?: GameMode;
  gameMap?: GameMap;
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
      this.presence = user.presence ?? 'Offline';
      this.activity = user.activity;
      this.queueType = user.queueType;
      this.gameType = user.gameType;
      this.gameMode = user.gameMode;
      this.gameMap = user.gameMap;
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
    return this.friends.filter(friend => friend.presence === 'Online');
  }

  get offlineFriends(): Friend[] {
    return this.friends.filter(friend => friend.presence === 'Offline');
  }

  get awayFriends(): Friend[] {
    return this.friends.filter(friend => friend.presence === 'Away');
  }
}
