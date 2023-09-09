import { SocialRoom } from '../rooms/SocialRoom';
import { User } from '../schemas/User';
import { SocialManager } from './SocialManager';

export class PresenceManager extends SocialManager {
  constructor(socialRoom: SocialRoom) {
    super(socialRoom);
  }

  notifyHostUserIsOnline(user: User) {
    this.socialRoom.hostClient.send('online', user);
  }

  notifyHostUserIsOffline(user: User) {
    this.socialRoom.hostClient.send('offline', user);
  }

  broadcastDisposeRoom() {
    this.socialRoom.broadcast('dispose', this.socialRoom.roomId);
  }
}
