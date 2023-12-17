import { Member } from './member.model';

export class LobbyMessage {
  _id?: string;
  createdAt: Date;
  from: Member;
  to: string;
  type: 'lobby-message' | 'system-message';
  content: string;

  constructor(message?: Partial<LobbyMessage>) {
    if (message) {
      this._id = message._id;
      this.createdAt = message.createdAt;
      this.from = new Member(message.from);
      this.to = message.to;
      this.content = message.content ?? '';
      this.type = message.type ?? 'lobby-message';
    }
  }
}
