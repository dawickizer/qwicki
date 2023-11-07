import { OnlineStatus } from '../model/online-status';
import { Inbox } from '../rooms/Inbox';
import { User } from '../schemas/User';
import { InboxManager } from './InboxManager';

export class PresenceManager extends InboxManager {
  constructor(inbox: Inbox) {
    super(inbox);
  }

  notifyHostUserOnlineStatus(user: User, onlineStatus?: OnlineStatus) {
    this.inbox.hostClient.send('onlineStatus', {
      id: user._id,
      onlineStatus: onlineStatus ? onlineStatus : user.onlineStatus,
    });
  }

  broadcastDisposeRoom() {
    this.inbox.broadcast('dispose', this.inbox.roomId, {
      except: this.inbox.hostClient,
    });
  }

  setOnMessageListeners() {
    this.inbox.onMessage(
      'setHostOnlineStatus',
      (client, onlineStatus: OnlineStatus) => {
        this.inbox.state.host.onlineStatus = onlineStatus;
        this.inbox.broadcast(
          'onlineStatus',
          {
            id: this.inbox.state.host._id,
            onlineStatus: this.inbox.state.host.onlineStatus,
          },
          { except: this.inbox.hostClient }
        );
      }
    );

    this.inbox.onMessage(
      'notifyHostOnlineStatus',
      (client, friend: { id: string; onlineStatus: OnlineStatus }) => {
        const user = this.inbox.getUserById(friend.id);
        user.onlineStatus = friend.onlineStatus;
        this.notifyHostUserOnlineStatus(user);
      }
    );
  }
}
