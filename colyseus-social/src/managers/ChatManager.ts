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
      if (user) {
        const userClient: Client = this.inbox.getClient(user);
        userClient.send('messageUser', message);
      }
    });

    this.inbox.onMessage(
      'userIsTyping',
      (client, data: { friendId: string; isTyping: boolean }) => {
        this.inbox.hostClient.send('userIsTyping', data);
      }
    );

    this.inbox.onMessage(
      'hostIsTyping',
      (client, data: { friendId: string; isTyping: boolean }) => {
        const host = this.inbox.state.host;
        const user = this.inbox.getUserById(data.friendId);
        if (user) {
          const userClient: Client = this.inbox.getClient(user);
          userClient.send('hostIsTyping', {
            friendId: host._id,
            isTyping: data.isTyping,
          });
        }
      }
    );
  }
}
