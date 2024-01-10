import { Client } from 'colyseus';
import { CustomGame } from '../../rooms/custom-game/CustomGame';
import { Player } from '../../schemas/player/Player';
import { Message } from '../../schemas/message/Message';
import { generateRandomUUID } from '../../utils/generateRandomUUID';
import { Activity } from '../../types/activity/activity.type';
import { GameType } from '../../types/game-type/game-type.type';
import { GameMode } from '../../types/game-mode/game-mode.type.';
import { GameMap } from '../../types/game-map/game-map.type';
import { MaxPlayerCount } from '../../types/max-player-count/max-player-count.type';
import { Visibility } from '../../types/visibility/visibility.type';

export class CustomGameManager {
  customGame: CustomGame;

  constructor(customGame: CustomGame) {
    this.customGame = customGame;
    this.setOnMessageListeners();
  }

  broadcastTransferHost() {
    this.customGame.broadcast('transferHost', this.customGame.state.host);
  }

  broadcastKickPlayer(player: Player) {
    this.customGame.broadcast('kickPlayer', player);
  }

  setOnMessageListeners() {
    this.customGame.onMessage(
      'sendMessage',
      (client: Client, message: Message) => {
        message = new Message({
          _id: generateRandomUUID(),
          createdAt: new Date().getTime(),
          type: 'game-message',
          to: this.customGame.roomId,
          from: this.customGame.state.getPlayer(client),
          content: message.content,
        });
        this.customGame.state.addMessage(message);
      }
    );

    this.customGame.onMessage(
      'kickPlayer',
      (client: Client, player: Player) => {
        if (this.customGame.isHost(client)) {
          this.broadcastKickPlayer(player);
          this.customGame.state.addMessage(
            new Message({
              _id: generateRandomUUID(),
              createdAt: new Date().getTime(),
              type: 'system-message',
              to: this.customGame.state._id,
              from: this.customGame.state.chatBot,
              content: `${player.username} was kicked`,
            })
          );
          this.customGame.getClient(player).leave();
        }
      }
    );

    this.customGame.onMessage('leaveCustomGame', (client: Client) => {
      client.send('leaveCustomGame');
      client.leave();
    });

    this.customGame.onMessage(
      'transferHost',
      (client: Client, player: Player) => {
        if (this.customGame.isHost(client)) {
          this.customGame.transferHost(this.customGame.getClient(player));
        }
      }
    );

    this.customGame.onMessage('setRoute', (client: Client, route: string) => {
      if (this.customGame.isHost(client)) {
        this.customGame.state.setRoute(route);
      }
    });

    this.customGame.onMessage(
      'setActivity',
      (client: Client, activity: Activity) => {
        if (this.customGame.isHost(client)) {
          this.customGame.state.setActivity(activity);
        }
      }
    );

    this.customGame.onMessage(
      'setGameType',
      (client: Client, gameType: GameType) => {
        if (this.customGame.isHost(client)) {
          this.customGame.state.setGameType(gameType);
        }
      }
    );

    this.customGame.onMessage(
      'setGameMode',
      (client: Client, gameMode: GameMode) => {
        if (this.customGame.isHost(client)) {
          this.customGame.state.setGameMode(gameMode);
        }
      }
    );

    this.customGame.onMessage(
      'setMaxPlayerCount',
      (client: Client, maxPlayerCount: MaxPlayerCount) => {
        if (
          this.customGame.isHost(client) &&
          maxPlayerCount >= this.customGame.state.players.size
        ) {
          this.customGame.state.setMaxPlayerCount(maxPlayerCount);
        }
      }
    );

    this.customGame.onMessage(
      'setVisibility',
      (client: Client, visibility: Visibility) => {
        if (this.customGame.isHost(client)) {
          this.customGame.setPrivate(visibility === 'Private (Invite Only)');
          this.customGame.state.setVisibility(visibility);
        }
      }
    );

    this.customGame.onMessage('setName', (client: Client, name: string) => {
      if (this.customGame.isHost(client)) {
        this.customGame.state.setName(name);
      }
    });

    this.customGame.onMessage(
      'setGameMap',
      (client: Client, gameMap: GameMap) => {
        if (this.customGame.isHost(client)) {
          this.customGame.state.setGameMap(gameMap);
        }
      }
    );

    this.customGame.onMessage(
      'toggleReady',
      (client: Client, player: Player) => {
        if (client.sessionId === player.sessionId) {
          this.customGame.state.toggleReady(player);
        }
      }
    );
  }
}
