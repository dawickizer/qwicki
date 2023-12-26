import { Invite } from '../invite/invite.model';
import { Member } from 'src/app/state/lobby/member.model';
import { Room } from 'colyseus.js';
import { LobbyMessage } from './lobby-message.model';
import { Visibility } from 'src/app/types/visibility/visibility.type';
import { Activity } from 'src/app/types/activity/activity.type';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap } from 'src/app/types/game-map/game-map.type';

export class Lobby {
  _id?: string;
  room: Room;
  isReady: boolean;
  route: string;
  activity?: Activity;
  queueType?: QueueType;
  gameType?: GameType;
  gameMode?: GameMode;
  gameMap?: GameMap;
  visibility: Visibility;
  host: Member;
  members: Map<string, Member>;
  messages: LobbyMessage[];
  outboundInvites: Invite[];

  // TODO: Not deep copying...should prob update this to be like game.model.ts
  constructor(lobby?: Partial<Lobby>) {
    if (lobby) {
      this._id = lobby._id;
      this.room = lobby.room;
      this.isReady = lobby.isReady ?? false;
      this.route = lobby.route;
      this.activity = lobby.activity;
      this.queueType = lobby.queueType;
      this.gameType = lobby.gameType;
      this.gameMode = lobby.gameMode;
      this.gameMap = lobby.gameMap;
      this.visibility = lobby.visibility;
      this.host = lobby.host;
      this.members = lobby.members;
      this.messages = lobby.messages;
      this.outboundInvites = lobby.outboundInvites;
    }
  }
}
