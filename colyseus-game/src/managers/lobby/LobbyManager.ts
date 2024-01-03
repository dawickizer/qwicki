import { Client } from 'colyseus';
import { Lobby } from '../../rooms/lobby/Lobby';
import { Member } from '../../schemas/member/Member';
import { Message } from '../../schemas/message/Message';
import { generateRandomUUID } from '../../utils/generateRandomUUID';
import { Activity } from '../../types/activity/activity.type';
import { QueueType } from '../../types/queue-type/queue-type.type';
import { GameType } from '../../types/game-type/game-type.type';
import { GameMode } from '../../types/game-mode/game-mode.type.';
import { GameMap } from '../../types/game-map/game-map.type';

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
        this.lobby.state.addMessage(
          new Message({
            _id: generateRandomUUID(),
            createdAt: new Date().getTime(),
            type: 'system-message',
            to: this.lobby.state._id,
            from: this.lobby.state.chatBot,
            content: `${member.username} was kicked`,
          })
        );
        this.lobby.getClient(member).leave();
      }
    });

    this.lobby.onMessage('leaveLobby', (client: Client) => {
      client.send('leaveLobby');
      client.leave();
    });

    this.lobby.onMessage('transferHost', (client: Client, member: Member) => {
      if (this.lobby.isHost(client)) {
        this.lobby.transferHost(this.lobby.getClient(member));
      }
    });

    this.lobby.onMessage('setRoute', (client: Client, route: string) => {
      if (this.lobby.isHost(client)) {
        this.lobby.state.setRoute(route);
      }
    });

    this.lobby.onMessage(
      'setActivity',
      (client: Client, activity: Activity) => {
        if (this.lobby.isHost(client)) {
          this.lobby.state.setActivity(activity);
        }
      }
    );

    this.lobby.onMessage(
      'setQueueType',
      (client: Client, queueType: QueueType) => {
        if (this.lobby.isHost(client)) {
          this.lobby.state.setQueueType(queueType);
        }
      }
    );

    this.lobby.onMessage(
      'setGameType',
      (client: Client, gameType: GameType) => {
        if (this.lobby.isHost(client)) {
          this.lobby.state.setGameType(gameType);
        }
      }
    );

    this.lobby.onMessage(
      'setGameMode',
      (client: Client, gameMode: GameMode) => {
        if (this.lobby.isHost(client)) {
          this.lobby.state.setGameMode(gameMode);
        }
      }
    );

    this.lobby.onMessage('setGameMap', (client: Client, gameMap: GameMap) => {
      if (this.lobby.isHost(client)) {
        this.lobby.state.setGameMap(gameMap);
      }
    });

    this.lobby.onMessage('toggleReady', (client: Client, member: Member) => {
      if (client.sessionId === member.sessionId) {
        this.lobby.state.toggleReady(member);
      }
    });
  }
}
