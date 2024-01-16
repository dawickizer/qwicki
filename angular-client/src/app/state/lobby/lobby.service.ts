import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LobbyStateService } from './lobby.state.service';
import { Lobby } from './lobby.model';
import { LobbyEffectService } from './lobby.effect.service';
import { Invite } from '../invite/invite.model';
import { Member } from 'src/app/state/lobby/member.model';
import { Room } from 'colyseus.js';
import { LobbyMessage } from './lobby-message.model';
import { Activity } from 'src/app/types/activity/activity.type';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap } from 'src/app/types/game-map/game-map.type';

@Injectable({
  providedIn: 'root',
})
export class LobbyService {
  get lobbyState$() {
    return this.lobbyStateService.lobbyState$;
  }

  get isLoading$(): Observable<boolean> {
    return this.lobbyStateService.isLoading$;
  }

  get lobby$(): Observable<Lobby | null> {
    return this.lobbyStateService.lobby$;
  }

  get id$(): Observable<string | null> {
    return this.lobbyStateService.id$;
  }

  get route$(): Observable<string | null> {
    return this.lobbyStateService.route$;
  }

  get activity$(): Observable<Activity | null> {
    return this.lobbyStateService.activity$;
  }

  get queueType$(): Observable<QueueType | null> {
    return this.lobbyStateService.queueType$;
  }

  get gameType$(): Observable<GameType | null> {
    return this.lobbyStateService.gameType$;
  }

  get gameMode$(): Observable<GameMode | null> {
    return this.lobbyStateService.gameMode$;
  }

  get gameMap$(): Observable<GameMap | null> {
    return this.lobbyStateService.gameMap$;
  }

  get isReady$(): Observable<boolean | null> {
    return this.lobbyStateService.isReady$;
  }

  get host$(): Observable<Member | null> {
    return this.lobbyStateService.host$;
  }

  get members$(): Observable<Map<string, Member> | null> {
    return this.lobbyStateService.members$;
  }

  get messages$(): Observable<LobbyMessage[] | null> {
    return this.lobbyStateService.messages$;
  }

  get outboundInvites$(): Observable<Invite[] | null> {
    return this.lobbyStateService.outboundInvites$;
  }

  isReadyByMemberSessionId$(sessionId: string): Observable<boolean> {
    return this.lobbyStateService.isReadyByMemberSessionId$(sessionId);
  }

  constructor(
    private lobbyEffectService: LobbyEffectService,
    private lobbyStateService: LobbyStateService
  ) {}

  createLobby(options: { jwt: string }): Observable<Lobby> {
    return this.lobbyEffectService.createLobby(options);
  }

  leaveLobby(lobby: Room): Observable<number> {
    return this.lobbyEffectService.leaveLobby(lobby);
  }

  connectToLobby(lobbyId: string, options: { jwt: string }): Observable<Lobby> {
    return this.lobbyEffectService.connectToLobby(lobbyId, options);
  }

  joinExistingLobbyIfPresent(
    lobbyId: string,
    options: { jwt: string }
  ): Observable<Lobby> {
    return this.lobbyEffectService.joinExistingLobbyIfPresent(lobbyId, options);
  }

  sendMessage(message: LobbyMessage): Observable<LobbyMessage> {
    return this.lobbyEffectService.sendMessage(message);
  }

  setInitialState(): void {
    this.lobbyStateService.setInitialState();
  }

  setLobby(lobby: Lobby): void {
    this.lobbyStateService.setLobby(lobby);
  }

  setRoute(route: string): void {
    this.lobbyStateService.setRoute(route);
  }

  setActivity(activity: Activity): void {
    this.lobbyStateService.setActivity(activity);
  }

  setQueueType(queueType: QueueType): void {
    this.lobbyStateService.setQueueType(queueType);
  }

  setGameType(gameType: GameType): void {
    this.lobbyStateService.setGameType(gameType);
  }

  setGameMode(gameMode: GameMode): void {
    this.lobbyStateService.setGameMode(gameMode);
  }

  setGameMap(gameMap: GameMap): void {
    this.lobbyStateService.setGameMap(gameMap);
  }

  setIsReady(isReady: boolean): void {
    this.lobbyStateService.setIsReady(isReady);
  }

  setHost(host: Member): void {
    this.lobbyStateService.setHost(host);
  }

  setMembers(members: Map<string, Member>): void {
    this.lobbyStateService.setMembers(members);
  }

  addMember(member: Member): void {
    this.lobbyStateService.addMember(member);
  }

  removeMember(member: Member): void {
    this.lobbyStateService.removeMember(member);
  }

  setMemberIsHost(member: Member, isHost: boolean): void {
    this.lobbyStateService.setMemberIsHost(member, isHost);
  }

  setMemberIsReady(member: Member, isReady: boolean): void {
    this.lobbyStateService.setMemberIsReady(member, isReady);
  }

  setMessages(messages: LobbyMessage[]): void {
    this.lobbyStateService.setMessages(messages);
  }

  addMessage(message: LobbyMessage): void {
    this.lobbyStateService.addMessage(message);
  }

  setIsLoading(isLoading: boolean): void {
    this.lobbyStateService.setIsLoading(isLoading);
  }
}
