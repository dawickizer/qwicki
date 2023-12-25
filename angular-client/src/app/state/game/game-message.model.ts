import { Player } from './player.model';

export class GameMessage {
  _id?: string;
  createdAt: Date;
  from: Player;
  to: string;
  type: 'game-message' | 'system-message';
  content: string;

  constructor(message?: Partial<GameMessage>) {
    if (message) {
      this._id = message._id;
      this.createdAt = message.createdAt;
      this.from = new Player(message.from);
      this.to = message.to;
      this.content = message.content ?? '';
      this.type = message.type ?? 'game-message';
    }
  }
}
