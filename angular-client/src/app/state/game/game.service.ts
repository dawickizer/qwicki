import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invite } from '../invite/invite.model';
import { Player } from 'src/app/state/game/player.model';
import { Room } from 'colyseus.js';
import { Game } from './game.model';
import { GameEffectService } from './game.effect.service';
import { GameStateService } from './game.state.service';
import { Activity } from 'src/app/types/activity/activity.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { GameMessage } from './game-message.model';
import { Team } from './team.model';
import { MaxPlayerCount } from 'src/app/types/max-player-count/max-player-count.type';
import { Visibility } from 'src/app/types/visibility/visibility.type';
import { GameMap } from 'src/app/types/game-map/game-map.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  get gameState$() {
    return this.gameStateService.gameState$;
  }

  get isLoading$(): Observable<boolean> {
    return this.gameStateService.isLoading$;
  }

  get game$(): Observable<Game | null> {
    return this.gameStateService.game$;
  }

  get route$(): Observable<string | null> {
    return this.gameStateService.route$;
  }

  get activity$(): Observable<Activity | null> {
    return this.gameStateService.activity$;
  }

  get gameType$(): Observable<GameType | null> {
    return this.gameStateService.gameType$;
  }

  get gameMode$(): Observable<GameMode | null> {
    return this.gameStateService.gameMode$;
  }

  get gameMap$(): Observable<GameMap | null> {
    return this.gameStateService.gameMap$;
  }

  get visibility$(): Observable<Visibility | null> {
    return this.gameStateService.visibility$;
  }

  get maxPlayerCount$(): Observable<MaxPlayerCount | null> {
    return this.gameStateService.maxPlayerCount$;
  }

  get host$(): Observable<Player | null> {
    return this.gameStateService.host$;
  }

  get players$(): Observable<Map<string, Player> | null> {
    return this.gameStateService.players$;
  }

  get messages$(): Observable<GameMessage[] | null> {
    return this.gameStateService.messages$;
  }

  get outboundInvites$(): Observable<Invite[] | null> {
    return this.gameStateService.outboundInvites$;
  }

  get teams$(): Observable<Map<string, Team> | null> {
    return this.gameStateService.teams$;
  }

  constructor(
    private gameEffectService: GameEffectService,
    private gameStateService: GameStateService
  ) {}

  createGame(options: { jwt: string }): Observable<Game> {
    return this.gameEffectService.createGame(options);
  }

  leaveGame(game: Room): Observable<number> {
    return this.gameEffectService.leaveGame(game);
  }

  connectToGame(gameId: string, options: { jwt: string }): Observable<Game> {
    return this.gameEffectService.connectToGame(gameId, options);
  }

  joinExistingGameIfPresent(
    gameId: string,
    options: { jwt: string }
  ): Observable<Game> {
    return this.gameEffectService.joinExistingGameIfPresent(gameId, options);
  }

  sendMessage(message: GameMessage): Observable<GameMessage> {
    return this.gameEffectService.sendMessage(message);
  }

  setInitialState(): void {
    this.gameStateService.setInitialState();
  }

  setGame(game: Game): void {
    this.gameStateService.setGame(game);
  }

  setHost(host: Player): void {
    this.gameStateService.setHost(host);
  }

  setRoute(route: string): void {
    this.gameStateService.setRoute(route);
  }

  setActivity(activity: Activity): void {
    this.gameStateService.setActivity(activity);
  }

  setGameType(gameType: GameType): void {
    this.gameStateService.setGameType(gameType);
  }

  setGameMode(gameMode: GameMode): void {
    this.gameStateService.setGameMode(gameMode);
  }

  setGameMap(gameMap: GameMap): void {
    this.gameStateService.setGameMap(gameMap);
  }

  setVisibility(visibility: Visibility): void {
    this.gameStateService.setVisibility(visibility);
  }

  setMaxPlayerCount(maxPlayerCount: MaxPlayerCount): void {
    this.gameStateService.setMaxPlayerCount(maxPlayerCount);
  }

  setOutboundInvites(invites: Invite[]): void {
    this.gameStateService.setOutboundInvites(invites);
  }

  addOutboundInvite(invite: Invite): void {
    this.gameStateService.addOutboundInvite(invite);
  }

  removeOutboundInvite(invite: Invite): void {
    this.gameStateService.removeOutboundInvite(invite);
  }

  setPlayers(players: Map<string, Player>): void {
    this.gameStateService.setPlayers(players);
  }

  addPlayer(player: Player): void {
    this.gameStateService.addPlayer(player);
  }

  removePlayer(player: Player): void {
    this.gameStateService.removePlayer(player);
  }

  setPlayerIsHost(player: Player, isHost: boolean): void {
    this.gameStateService.setPlayerIsHost(player, isHost);
  }

  setMessages(messages: GameMessage[]): void {
    this.gameStateService.setMessages(messages);
  }

  addMessage(message: GameMessage): void {
    this.gameStateService.addMessage(message);
  }

  setTeams(teams: Map<string, Team>): void {
    this.gameStateService.setTeams(teams);
  }

  addTeam(team: Team): void {
    this.gameStateService.addTeam(team);
  }

  removeTeam(team: Team): void {
    this.gameStateService.removeTeam(team);
  }

  setIsLoading(isLoading: boolean): void {
    this.gameStateService.setIsLoading(isLoading);
  }
}
