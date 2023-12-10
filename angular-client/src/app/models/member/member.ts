export class Member {
  _id: string;
  sessionId: string;
  username: string;
  isHost: boolean;

  constructor(member?: Partial<Member>) {
    if (member) {
      this._id = member._id;
      this.sessionId = member.sessionId;
      this.username = member.username;
      this.isHost = member.isHost;
    }
  }
}
