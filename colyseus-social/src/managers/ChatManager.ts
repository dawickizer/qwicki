import { Client } from 'colyseus';
import { Inbox } from '../rooms/Inbox';
import { InboxManager } from './InboxManager';

export class ChatManager extends InboxManager {
  constructor(inbox: Inbox) {
    super(inbox);
  }

  setOnMessageListeners() {
    this.inbox.onMessage('messageHost', (client, message) => {
      this.inbox.hostClient.send('messageHost', message);
    });

    this.inbox.onMessage('messageUser', (client, message) => {
      const user = this.inbox.getUserById(message.to._id);
      const userClient: Client = this.inbox.getClient(user);
      userClient.send('messageUser', message);
    });
  }
}
