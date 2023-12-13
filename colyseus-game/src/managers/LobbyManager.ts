import { Lobby } from '../rooms/Lobby';
import { Message } from '../schemas/lobby/Message';
import { generateRandomUUID } from '../utils/generateRandomUUID';

export class LobbyManager {
  lobby: Lobby;

  constructor(lobby: Lobby) {
    this.lobby = lobby;
    this.setOnMessageListeners();
  }

  setOnMessageListeners() {
    this.lobby.onMessage('sendMessage', (client, message) => {
      message = new Message({
        _id: generateRandomUUID(),
        createdAt: new Date().getTime(),
        type: 'lobby-message',
        to: this.lobby.roomId,
        from: this.lobby.state.getMember(client),
        content: message.content,
      });
      this.lobby.state.addMessage(message);
    });

    this.lobby.onMessage('kickMember', (client, member) => {
      if (this.lobby.isHost(client)) {
        this.lobby.getClient(member).leave();
        this.lobby.state.deleteMember(member);
      }
    });
  }
}
