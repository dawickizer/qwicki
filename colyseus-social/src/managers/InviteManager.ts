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

    this.inbox.onMessage('revokeInviteToHost', (client, invite) => {
      this.inbox.hostClient.send('revokeInviteToHost', invite);
    });

    this.inbox.onMessage('revokeInviteToUser', (client, invite) => {
      const user = this.inbox.getUserById(invite.to._id);
      if (user) {
        const userClient: Client = this.inbox.getClient(user);
        userClient.send('revokeInviteToUser', invite);
      }
    });

    this.inbox.onMessage('rejectInviteToHost', (client, invite) => {
      this.inbox.hostClient.send('rejectInviteToHost', invite);
    });

    this.inbox.onMessage('rejectInviteToUser', (client, invite) => {
      const user = this.inbox.getUserById(invite.from._id);
      if (user) {
        const userClient: Client = this.inbox.getClient(user);
        userClient.send('rejectInviteToUser', invite);
      }
    });

    this.inbox.onMessage('acceptInviteToHost', (client, invite) => {
      this.inbox.hostClient.send('acceptInviteToHost', invite);
    });

    this.inbox.onMessage('acceptInviteToUser', (client, invite) => {
      const user = this.inbox.getUserById(invite.from._id);
      if (user) {
        const userClient: Client = this.inbox.getClient(user);
        userClient.send('acceptInviteToUser', invite);
      }
    });
  }
}
