import { Client } from 'colyseus';
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

  broadcastTransferHost() {
    this.lobby.broadcast('transferHost', this.lobby.state.host);
  }

  broadcastKickMember(member: Member) {
    this.lobby.broadcast('kickMember', member);
  }

  setOnMessageListeners() {
    this.lobby.onMessage('sendMessage', (client: Client, message: Message) => {
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

    this.lobby.onMessage('kickMember', (client: Client, member: Member) => {
      if (this.lobby.isHost(client)) {
        this.broadcastKickMember(member);
        this.lobby.getClient(member).leave();
      }
    });

    this.lobby.onMessage('transferHost', (client: Client, member: Member) => {
      if (this.lobby.isHost(client)) {
        this.lobby.transferHost(this.lobby.getClient(member));
      }
    });
  }
}
