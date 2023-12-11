import { Lobby } from '../rooms/Lobby';
import { Member } from '../schemas/lobby/Member';
import { Message } from '../schemas/lobby/Message';
import { generateRandomUUID } from '../utils/generateRandomUUID';

export class LobbyManager {
  lobby: Lobby;

  constructor(lobby: Lobby) {
    this.lobby = lobby;
    this.setOnMessageListeners();
  }

  setOnMessageListeners() {
    // TODO: Consider all kinds of logic around confirming sender
    this.lobby.onMessage('sendMessage', (client, message) => {
      message = new Message({
        _id: generateRandomUUID(),
        createdAt: new Date().getTime(),
        type: 'lobby-message',
        to: this.lobby.roomId,
        from: new Member(message.from),
        content: message.content,
      });
      this.lobby.state.messages.push(message);
    });
  }
}
