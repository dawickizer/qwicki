import { Inbox } from '../rooms/Inbox';
import { User } from '../schemas/User';
import { InboxManager } from './InboxManager';

export class PresenceManager extends InboxManager {
  constructor(inbox: Inbox) {
    super(inbox);
  }

  notifyHostUserIsOnline(user: User) {
    this.inbox.hostClient.send('online', user._id);
  }

  notifyHostUserIsOffline(user: User) {
    this.inbox.hostClient.send('offline', user._id);
  }

  notifyHostUserIsAway(user: User) {
    this.inbox.hostClient.send('away', user._id);
  }

  broadcastDisposeRoom() {
    this.inbox.broadcast('dispose', this.inbox.roomId);
  }
}
