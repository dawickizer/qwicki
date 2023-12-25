import { Invite } from '../invite/invite.model';
import { Player } from './player.model';
import { GameMessage } from './game-message.model';
import { TeamName } from 'src/app/types/team-name/team-type.type';

export class Team {
  _id?: string;
  name?: TeamName;
  score?: number;
  players?: Map<string, Player>;
  messages?: GameMessage[];
  outboundInvites?: Invite[];

  constructor(team?: Partial<Team>) {
    if (team) {
      this._id = team._id;
      this.name = team.name;
      this.score = team.score;
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
