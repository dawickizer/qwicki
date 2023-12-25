export class Player {
  _id?: string;
  sessionId?: string;
  username?: string;
  isHost?: boolean;
  color?: string;
  score?: number;

  constructor(player?: Partial<Player>) {
    if (player) {
      this._id = player._id;
      this.sessionId = player.sessionId;
      this.username = player.username;
      this.isHost = player.isHost;
      this.color = player.color ?? '#FFFFFF';
      this.score = player.score;
    }
  }
}
