import { Client } from 'colyseus';
import { Inbox } from '../rooms/Inbox';
import { InboxManager } from './InboxManager';

export class FriendManager extends InboxManager {
  constructor(inbox: Inbox) {
    super(inbox);
    this.setOnMessageListeners();
  }

  setOnMessageListeners() {
    this.inbox.onMessage('sendFriendRequest', (client, friendRequest) => {
      this.inbox.hostClient.send('sendFriendRequest', friendRequest);
    });

    this.inbox.onMessage('acceptFriendRequest', (client, friendRequest) => {
      const user = this.inbox.getUserById(friendRequest.to._id);
      if (user)
        this.inbox.hostClient.send('acceptFriendRequest', {
          friendRequest,
          status: user.status,
        });
    });

    this.inbox.onMessage('rejectFriendRequest', (client, friendRequest) => {
      this.inbox.hostClient.send('rejectFriendRequest', friendRequest);
    });

    this.inbox.onMessage('revokeFriendRequest', (client, friendRequest) => {
      this.inbox.hostClient.send('revokeFriendRequest', friendRequest);
    });

    this.inbox.onMessage('removeFriend', (client, friend) => {
      this.inbox.hostClient.send('removeFriend', friend);
    });

    this.inbox.onMessage('disconnectFriend', (client, friend) => {
      const user = this.inbox.getUserById(friend._id);
      // only proceed if user is found. There is a scenario where the frontend fires off a disconnectFriend
      // message but the friend might not be in the inbox and is just offline
      if (user) {
        const userClient: Client = this.inbox.getClient(user);
        userClient.send('disconnectFriend', this.inbox.state.host);
        userClient.leave();
      }
    });
  }
}
