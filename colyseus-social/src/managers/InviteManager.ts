import { Client } from 'colyseus';
import { Inbox } from '../rooms/Inbox';
import { InboxManager } from './InboxManager';

export class InviteManager extends InboxManager {
  constructor(inbox: Inbox) {
    super(inbox);
    this.setOnMessageListeners();
  }

  setOnMessageListeners() {
    this.inbox.onMessage('sendInviteToHost', (client, invite) => {
      this.inbox.hostClient.send('sendInviteToHost', invite);
    });

    this.inbox.onMessage('sendInviteToUser', (client, invite) => {
      const user = this.inbox.getUserById(invite.to._id);
      if (user) {
        const userClient: Client = this.inbox.getClient(user);
        userClient.send('sendInviteToUser', invite);
      }
    });

    this.inbox.onMessage('acceptInvite', (client, invite) => {
      const user = this.inbox.getUserById(invite.to._id);
      if (user)
        this.inbox.hostClient.send('acceptInvite', {
          invite,
          onlineStatus: user.onlineStatus,
        });
    });

    this.inbox.onMessage('rejectInvite', (client, invite) => {
      this.inbox.hostClient.send('rejectInvite', invite);
    });

    this.inbox.onMessage('revokeInvite', (client, invite) => {
      this.inbox.hostClient.send('revokeInvite', invite);
    });

    this.inbox.onMessage('removeFriend', (client, friend) => {
      this.inbox.hostClient.send('removeFriend', friend);
    });
  }
}
