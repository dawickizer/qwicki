import { Inbox } from '../rooms/Inbox';
import { Status } from '../schemas/Status';
import { User } from '../schemas/User';
import { InboxManager } from './InboxManager';

export class PresenceManager extends InboxManager {
  constructor(inbox: Inbox) {
    super(inbox);
    this.setOnMessageListeners();
  }

  notifyHostUserStatus(user: User, status?: Partial<Status>) {
    this.inbox.hostClient.send('status', {
      id: user._id,
      status: status ? status : user.status,
    });
  }

  broadcastDisposeRoom() {
    this.inbox.broadcast('dispose', this.inbox.roomId, {
      except: this.inbox.hostClient,
    });
  }

  setOnMessageListeners() {
    this.inbox.onMessage('updateHostStatus', (client, status: Status) => {
      this.inbox.state.host.status = new Status(status);
      this.inbox.broadcast(
        'status',
        {
          id: this.inbox.state.host._id,
          status: this.inbox.state.host.status,
        },
        { except: this.inbox.hostClient }
      );
    });

    this.inbox.onMessage(
      'notifyHostStatus',
      (client, friend: { id: string; status: Status }) => {
        const user = this.inbox.getUserById(friend.id);
        user.status = new Status(friend.status);
        this.notifyHostUserStatus(user);
      }
    );
  }
}
