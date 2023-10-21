import { Client } from 'colyseus';
import { Inbox } from '../rooms/Inbox';
import { InboxManager } from './InboxManager';

export class FriendManager extends InboxManager {
  constructor(inbox: Inbox) {
    super(inbox);
  }

  setOnMessageListeners() {
    this.inbox.onMessage('sendFriendRequest', (client, friendRequest) => {
      this.inbox.hostClient.send('sendFriendRequest', friendRequest);
    });

    this.inbox.onMessage(
      'acceptFriendRequest',
      (client, friendRequest) => {
        this.inbox.hostClient.send('acceptFriendRequest', friendRequest);
      }
    );

    this.inbox.onMessage(
      'rejectFriendRequest',
      (client, friendRequest) => {
        this.inbox.hostClient.send('rejectFriendRequest', friendRequest);
      }
    );

    this.inbox.onMessage(
      'revokeFriendRequest',
      (client, friendRequest) => {
        this.inbox.hostClient.send('revokeFriendRequest', friendRequest);
      }
    );

    this.inbox.onMessage('removeFriend', (client, friend) => {
      this.inbox.hostClient.send('removeFriend', friend);
    });

    this.inbox.onMessage('disconnectFriend', (client, friend) => {
      const user = this.inbox.getUserById(friend._id);
      const userClient: Client = this.inbox.getClient(user);
      userClient.send('disconnectFriend', this.inbox.state.host);
      userClient.leave();
    });
  }
}
