import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LobbyStateService } from './lobby.state.service';
import { Lobby } from './lobby.model';
import { LobbyEffectService } from './lobby.effect.service';
import {
  Activity,
  GameType,
  Presence,
  QueueType,
  Status,
} from 'src/app/models/status/status.model';
import { Invite } from '../invite/invite.model';
import { Message } from '../message/message.model';
import { Member } from 'src/app/models/member/member';
import { Room } from 'colyseus.js';

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

  get status$(): Observable<Status | null> {
    return this.lobbyStateService.status$;
  }

  get presence$(): Observable<Presence | null> {
    return this.lobbyStateService.presence$;
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

  get host$(): Observable<Member | null> {
    return this.lobbyStateService.host$;
  }

  get members$(): Observable<Map<string, Member> | null> {
    return this.lobbyStateService.members$;
  }

  get messages$(): Observable<Message[] | null> {
    return this.lobbyStateService.messages$;
  }

  get outboundInvites$(): Observable<Invite[] | null> {
    return this.lobbyStateService.outboundInvites$;
  }

  constructor(
    private lobbyEffectService: LobbyEffectService,
    private lobbyStateService: LobbyStateService
  ) {}

  createLobby(lobbyId: string, options: { jwt: string }): Observable<Lobby> {
    return this.lobbyEffectService.createLobby(lobbyId, options);
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

  setInitialState(): void {
    this.lobbyStateService.setInitialState();
  }

  setLobby(lobby: Lobby): void {
    this.lobbyStateService.setLobby(lobby);
  }

  setStatus(status: Status): void {
    this.lobbyStateService.setStatus(status);
  }

  updateStatus(status: Partial<Status>): void {
    this.lobbyStateService.updateStatus(status);
  }

  setHost(host: Member): void {
    this.lobbyStateService.setHost(host);
  }

  // setMembers(members: Member[]): void {
  //   this.lobbyStateService.setMembers(members);
  // }

  // addMember(member: Member): void {
  //   this.lobbyStateService.addMember(member);
  // }

  // removeMember(member: Member): void {
  //   this.lobbyStateService.removeMember(member);
  // }

  setIsLoading(isLoading: boolean): void {
    this.lobbyStateService.setIsLoading(isLoading);
  }
}
