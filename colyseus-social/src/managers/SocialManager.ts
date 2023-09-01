import { SocialRoom } from '../rooms/SocialRoom';

export class SocialManager {
  socialRoom: SocialRoom;

  constructor(socialRoom: SocialRoom) {
    this.socialRoom = socialRoom;
  }
}
