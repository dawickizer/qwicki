import { Schema, type, MapSchema, ArraySchema } from '@colyseus/schema';
import { Player } from '../player/Player';
import { Activity } from '../../types/activity/activity.type';
import { GameType } from '../../types/game-type/game-type.type';
import { GameMode } from '../../types/game-mode/game-mode.type.';
import { GameMap } from '../../types/game-map/game-map.type';
import { Visibility } from '../../types/visibility/visibility.type';
import { MaxPlayerCount } from '../../types/max-player-count/max-player-count.type';
import { Message } from '../message/Message';
import { Invite } from '../invite/Invite';
import { generateRandomUUID } from '../../utils/generateRandomUUID';
import { Client } from 'colyseus';

export class CustomGameState extends Schema {
  @type('string') _id: string;
  @type('string') route: string;
  @type('string') activity?: Activity;
  @type('string') gameType?: GameType;
  @type('string') gameMode?: GameMode;
  @type('string') gameMap?: GameMap;
  @type('string') visibility?: Visibility;
  @type('number') maxPlayerCount?: MaxPlayerCount;
  @type(Player) host = new Player();
  @type({ map: Player }) players = new MapSchema<Player>();
  @type([Message]) messages = new ArraySchema<Message>();
  @type([Invite]) outboundInvites = new ArraySchema<Invite>();
  @type('boolean') isReady: boolean;

  chatBot: Player = new Player({
    _id: generateRandomUUID(),
    username: '',
    color: '#008080',
  });

  private availableColors = [
    '#007bff',
    '#BA55D3',
    '#FFD700',
    '#32CD32',
    '#C72929',
  ];
  private colorAssignments = new Map<string, string>();

  addPlayer(player: Player) {
    this.players.set(player.sessionId, player);
    this.assignColor(player.sessionId);
    this.addMessage(
      new Message({
        _id: generateRandomUUID(),
        createdAt: new Date().getTime(),
        type: 'system-message',
        to: this._id,
        from: this.chatBot,
        content: `${player.username} joined`,
      })
    );
    this.determineIsReady();
    console.log(`${player.username} joined`);
    this.logPlayers();
  }

  deletePlayer(player: Player) {
    this.freeUpColor(player.sessionId);
    this.players.delete(player.sessionId);
    this.addMessage(
      new Message({
        _id: generateRandomUUID(),
        createdAt: new Date().getTime(),
        type: 'system-message',
        to: this._id,
        from: this.chatBot,
        content: `${player.username} left`,
      })
    );
    this.determineIsReady();
    console.log(`${player.username} left`);
    this.logPlayers();
  }

  getPlayer(client: Client): Player {
    return this.players.get(client.sessionId);
  }

  getPlayerById(id: string) {
    for (const player of this.players.values()) {
      if (player._id === id) {
        return player;
      }
    }
    return null;
  }

  logPlayers() {
    console.log('Players in the lobby:');
    this.players.forEach(player => console.log(`${player.username}`));
  }

  addMessage(message: Message) {
    this.messages.push(message);
  }

  setHost(hostClient: Client) {
    this.host = new Player(this.players.get(hostClient.sessionId));
    this.players.forEach(player => {
      player.isHost = player.sessionId === hostClient.sessionId;
    });
    this.addMessage(
      new Message({
        _id: generateRandomUUID(),
        createdAt: new Date().getTime(),
        type: 'system-message',
        to: this._id,
        from: this.chatBot,
        content: `${this.host.username} is the host`,
      })
    );
    console.log(`${this.host.username} is the host`);
  }

  setRoute(route: string) {
    this.route = route;
  }

  setActivity(activity: Activity) {
    this.activity = activity;
  }

  setGameType(gameType: GameType) {
    this.gameType = gameType;
  }

  setGameMode(gameMode: GameMode) {
    this.gameMode = gameMode;
  }

  setGameMap(gameMap: GameMap) {
    this.gameMap = gameMap;
  }

  toggleReady(player: Player) {
    this.players.get(player.sessionId).isReady = !this.players.get(
      player.sessionId
    ).isReady;
    this.determineIsReady();
  }

  determineIsReady(): boolean {
    let allReady = true;
    if (this.players.size === 1) {
      this.isReady = allReady;
      return allReady;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [sessionId, player] of this.players) {
      if (!player.isReady) {
        allReady = false;
        break;
      }
    }
    this.isReady = allReady; // state update
    return allReady;
  }

  assignColor(playerId: string) {
    if (!this.colorAssignments.has(playerId)) {
      const color = this.availableColors.shift() ?? '';
      this.colorAssignments.set(playerId, color);
      this.players.get(playerId).color = color;
    }
  }

  freeUpColor(playerId: string) {
    const color = this.colorAssignments.get(playerId);
    if (color) {
      this.availableColors.push(color);
      this.colorAssignments.delete(playerId);
    }
  }
}
