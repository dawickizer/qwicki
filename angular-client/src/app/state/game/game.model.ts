import { Invite } from '../invite/invite.model';
import { Room } from 'colyseus.js';
import { GameMessage } from './game-message.model';
import { Visibility } from 'src/app/types/visibility/visibility.type';
import { Activity } from 'src/app/types/activity/activity.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap } from 'src/app/types/game-map/game-map.type';
import { Player } from './player.model';
import { MaxPlayerCount } from 'src/app/types/max-player-count/max-player-count.type';
import { Team } from './team.model';

export class Game {
  _id?: string;
  room?: Room;
  route?: string;
  activity?: Activity;
  gameType?: GameType;
  gameMode?: GameMode;
  gameMap?: GameMap;
  visibility?: Visibility;
  maxPlayerCount?: MaxPlayerCount;
  host?: Player;
  players?: Map<string, Player>;
  messages?: GameMessage[];
  outboundInvites?: Invite[];
  teams?: Map<string, Team>;

  constructor(game?: Partial<Game>) {
    if (game) {
      this._id = game._id;
      this.room = game.room;
      this.route = game.route;
      this.activity = game.activity;
      this.gameType = game.gameType;
      this.gameMode = game.gameMode;
      this.gameMap = game.gameMap;
      this.visibility = game.visibility;
      this.maxPlayerCount = game.maxPlayerCount;
      this.host = new Player(game.host);
      this.players = game.players
        ? new Map(
            Array.from(game.players).map(([key, player]) => [
              key,
              new Player(player),
            ])
          )
        : new Map();
      this.messages =
        game.messages.map(message => new GameMessage(message)) ?? [];
      this.outboundInvites =
        game.outboundInvites.map(invite => new Invite(invite)) ?? [];
      this.teams = game.teams
        ? new Map(
            Array.from(game.teams).map(([key, team]) => [key, new Team(team)])
          )
        : new Map();
    }
  }
}
