import { Client } from 'colyseus';
import { SocialRoom } from '../rooms/SocialRoom';
import { SocialManager } from './SocialManager';

export class ChatManager extends SocialManager {
  constructor(socialRoom: SocialRoom) {
    super(socialRoom);
  }

  setOnMessageListeners() {
    this.socialRoom.onMessage('messageHost', (client, message) => {
      this.socialRoom.hostClient.send('messageHost', message);
    });

    this.socialRoom.onMessage('messageUser', (client, message) => {
      const user = this.socialRoom.getUserById(message.to._id);
      const userClient: Client = this.socialRoom.getClient(user);
      userClient.send('messageUser', message);
    });
  }
}
