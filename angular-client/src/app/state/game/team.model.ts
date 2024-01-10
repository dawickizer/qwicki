import { Player } from './player.model';
import { GameMessage } from './game-message.model';
import { TeamName } from 'src/app/types/team-name/team-name.type';
import { MaxPlayerCount } from 'src/app/types/max-player-count/max-player-count.type';
import { Invite } from '../invite/invite.model';

export class Team {
  _id?: string;
  name?: TeamName;
  score?: number;
  maxPlayerCount?: MaxPlayerCount;
  players?: Map<string, Player>;
  messages?: GameMessage[];
  outboundInvites?: Invite[];

  constructor(team?: Partial<Team>) {
    if (team) {
      this._id = team._id;
      this.name = team.name;
      this.score = team.score;
      this.maxPlayerCount = team.maxPlayerCount;
      this.players = team.players
        ? new Map(
            Array.from(team.players).map(([key, player]) => [
              key,
              new Player(player),
            ])
          )
        : new Map();
      this.messages =
        team.messages.map(message => new GameMessage(message)) ?? [];
      this.outboundInvites =
        team.outboundInvites.map(invite => new Invite(invite)) ?? [];
    }
  }
}
