import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState, initialState } from './game.state';
import {
  activitySelector,
  gameTypeSelector,
  isLoadingSelector,
  hostSelector,
  messagesSelector,
  outboundInvitesSelector,
  gameSelector,
  playersSelector,
  teamsSelector,
  gameModeSelector,
  gameMapSelector,
  visibilitySelector,
  maxPlayerCountSelector,
  routeSelector,
  nameSelector,
  teamByIdSelector,
  maxPlayerCountByTeamSelector,
  idSelector,
} from './game.state.selectors';
import { Game } from './game.model';
import { Player } from 'src/app/state/game/player.model';
import { GameMessage } from './game-message.model';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap } from 'src/app/types/game-map/game-map.type';
import { Activity } from 'src/app/types/activity/activity.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { Visibility } from 'src/app/types/visibility/visibility.type';
import { MaxPlayerCount } from 'src/app/types/max-player-count/max-player-count.type';
import { Invite } from '../invite/invite.model';
import { Team } from './team.model';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private _gameState = new BehaviorSubject<GameState>(initialState);

  public gameState$: Observable<GameState> = this._gameState.asObservable();
  public isLoading$ = isLoadingSelector(this.gameState$);
  public game$ = gameSelector(this.gameState$);
  public id$ = idSelector(this.game$);
  public route$ = routeSelector(this.game$);
  public activity$ = activitySelector(this.game$);
  public gameType$ = gameTypeSelector(this.game$);
  public gameMode$ = gameModeSelector(this.game$);
  public gameMap$ = gameMapSelector(this.game$);
  public visibility$ = visibilitySelector(this.game$);
  public maxPlayerCount$ = maxPlayerCountSelector(this.game$);
  public name$ = nameSelector(this.game$);
  public host$ = hostSelector(this.game$);
  public players$ = playersSelector(this.game$);
  public messages$ = messagesSelector(this.game$);
  public outboundInvites$ = outboundInvitesSelector(this.game$);
  public teams$ = teamsSelector(this.game$);

  // dynamic selectors
  teamById$(id: string): Observable<Team | null> {
    return teamByIdSelector(this.teams$, id);
  }

  maxPlayerCountByTeamId$(id: string): Observable<MaxPlayerCount | null> {
    return maxPlayerCountByTeamSelector(this.teamById$(id));
  }

  setInitialState() {
    this._gameState.next(initialState);
  }

  setGame(game: Game): void {
    const currentState = this._gameState.value;
    this._gameState.next({ ...currentState, game: new Game(game) });
  }

  setHost(host: Player): void {
    const currentState = this._gameState.value;
    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, host: new Player(host) }),
    });
  }

  setRoute(route: string): void {
    const currentState = this._gameState.value;
    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, route }),
    });
  }

  setActivity(activity: Activity): void {
    const currentState = this._gameState.value;
    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, activity }),
    });
  }

  setGameType(gameType: GameType): void {
    const currentState = this._gameState.value;
    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, gameType }),
    });
  }

  setGameMode(gameMode: GameMode): void {
    const currentState = this._gameState.value;
    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, gameMode }),
    });
  }

  setGameMap(gameMap: GameMap): void {
    const currentState = this._gameState.value;
    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, gameMap }),
    });
  }

  setVisibility(visibility: Visibility): void {
    const currentState = this._gameState.value;
    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, visibility }),
    });
  }

  setMaxPlayerCount(maxPlayerCount: MaxPlayerCount): void {
    const currentState = this._gameState.value;
    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, maxPlayerCount }),
    });
  }

  setName(name: string): void {
    const currentState = this._gameState.value;
    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, name }),
    });
  }

  setOutboundInvites(invites: Invite[]): void {
    const currentState = this._gameState.value;
    this._gameState.next({
      ...currentState,
      game: new Game({
        ...currentState.game,
        outboundInvites: invites.map(invite => new Invite(invite)),
      }),
    });
  }

  addOutboundInvite(invite: Invite): void {
    const currentState = this._gameState.value;
    const updatedInvites = currentState.game.outboundInvites
      ? [...currentState.game.outboundInvites, new Invite(invite)]
      : [new Invite(invite)];

    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, outboundInvites: updatedInvites }),
    });
  }

  removeOutboundInvite(invite: Invite): void {
    const currentState = this._gameState.value;
    if (!currentState.game.outboundInvites) return;

    const updatedInvites = currentState.game.outboundInvites.filter(
      currentInvite => currentInvite._id !== invite._id
    );

    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, outboundInvites: updatedInvites }),
    });
  }

  setPlayers(players: Map<string, Player>): void {
    const currentState = this._gameState.value;

    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, players: new Map(players) }),
    });
  }

  addPlayer(player: Player): void {
    const currentState = this._gameState.value;
    const updatedPlayers = new Map(currentState.game.players);
    updatedPlayers.set(player.sessionId, new Player(player));

    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, players: updatedPlayers }),
    });
  }

  removePlayer(player: Player): void {
    const currentState = this._gameState.value;
    const updatedPlayers = new Map(currentState.game.players);
    updatedPlayers.delete(player.sessionId);

    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, players: updatedPlayers }),
    });
  }

  setPlayerIsHost(player: Player, isHost: boolean): void {
    const currentState = this._gameState.value;

    // Deep copy the players and update the player's isHost property
    const updatedPlayers = new Map<string, Player>();
    currentState.game.players.forEach((m, sessionId) => {
      updatedPlayers.set(
        sessionId,
        sessionId === player.sessionId
          ? new Player({ ...m, isHost })
          : new Player(m)
      );
    });

    // Update the state with a new Game instance
    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, players: updatedPlayers }),
    });
  }

  setMessages(messages: GameMessage[]): void {
    const currentState = this._gameState.value;
    if (!currentState.game) return;
    this._gameState.next({
      ...currentState,
      game: new Game({
        ...currentState.game,
        messages: [...messages].map(message => new GameMessage(message)),
      }),
    });
  }

  addMessage(message: GameMessage): void {
    const currentState = this._gameState.value;
    if (!currentState.game) return;

    const updatedMessages = [
      ...currentState.game.messages,
      new GameMessage(message),
    ];
    this._gameState.next({
      ...currentState,
      game: new Game({
        ...currentState.game,
        messages: updatedMessages.map(message => new GameMessage(message)),
      }),
    });
  }

  setTeams(teams: Map<string, Team>): void {
    const currentState = this._gameState.value;
    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, teams: new Map(teams) }),
    });
  }

  addTeam(team: Team): void {
    const currentState = this._gameState.value;
    const updatedTeams = new Map(currentState.game.teams);
    updatedTeams.set(team._id, new Team(team));

    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, teams: updatedTeams }),
    });
  }

  removeTeam(team: Team): void {
    const currentState = this._gameState.value;
    const updatedTeams = new Map(currentState.game.teams);
    updatedTeams.delete(team._id);

    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, teams: updatedTeams }),
    });
  }

  joinTeam(teamId: string, playerId: string): void {
    const currentState = this._gameState.value;
    const updatedTeams = new Map(currentState.game.teams);

    updatedTeams.forEach(team => {
      if (team.players.has(playerId)) {
        team.players.delete(playerId);
      }
    });

    const teamToJoin = updatedTeams.get(teamId);
    if (teamToJoin && !teamToJoin.players.has(playerId)) {
      teamToJoin.players.set(playerId, currentState.game.players.get(playerId));
    }

    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, teams: updatedTeams }),
    });
  }

  leaveTeam(teamId: string, playerId: string): void {
    const currentState = this._gameState.value;
    const updatedTeams = new Map(currentState.game.teams);
    const team = updatedTeams.get(teamId);

    if (team && team.players.has(playerId)) {
      team.players.delete(playerId);
    }

    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, teams: updatedTeams }),
    });
  }

  setMaxPlayerCountByTeamId(
    teamId: string,
    maxPlayerCount: MaxPlayerCount
  ): void {
    const currentState = this._gameState.value;
    const updatedTeams = new Map(currentState.game.teams);
    const team = updatedTeams.get(teamId);

    if (team) {
      team.maxPlayerCount = maxPlayerCount;
    }

    this._gameState.next({
      ...currentState,
      game: new Game({ ...currentState.game, teams: updatedTeams }),
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._gameState.value;
    this._gameState.next({ ...currentState, isLoading });
  }
}
