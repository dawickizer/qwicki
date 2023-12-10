import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LobbyState, initialState } from './lobby.state';
import {
  activitySelector,
  gameTypeSelector,
  isLoadingSelector,
  presenceSelector,
  queueTypeSelector,
  statusSelector,
  lobbySelector,
  hostSelector,
  membersSelector,
  messagesSelector,
  outboundInvitesSelector,
} from './lobby.state.selectors';
import { Lobby } from './lobby.model';
import { Status } from 'src/app/models/status/status.model';
import { Member } from 'src/app/models/member/member';

@Injectable({
  providedIn: 'root',
})
export class LobbyStateService {
  private _lobbyState = new BehaviorSubject<LobbyState>(initialState);

  public lobbyState$: Observable<LobbyState> = this._lobbyState.asObservable();
  public isLoading$ = isLoadingSelector(this.lobbyState$);
  public lobby$ = lobbySelector(this.lobbyState$);
  public status$ = statusSelector(this.lobby$);
  public presence$ = presenceSelector(this.status$);
  public activity$ = activitySelector(this.status$);
  public queueType$ = queueTypeSelector(this.status$);
  public gameType$ = gameTypeSelector(this.status$);
  public host$ = hostSelector(this.lobby$);
  public members$ = membersSelector(this.lobby$);
  public messages$ = messagesSelector(this.lobby$);
  public outboundInvites$ = outboundInvitesSelector(this.lobby$);

  setInitialState() {
    this._lobbyState.next(initialState);
  }

  setLobby(lobby: Lobby): void {
    const currentState = this._lobbyState.value;
    this._lobbyState.next({ ...currentState, lobby: new Lobby(lobby) });
  }

  setStatus(status: Status): void {
    const currentState = this._lobbyState.value;
    if (!currentState.lobby) return;
    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({ ...currentState.lobby, status } as Lobby),
    });
  }

  updateStatus(status: Partial<Status>): void {
    const currentState = this._lobbyState.value;
    if (!currentState.lobby) return;

    // Merge new status with existing status
    const updatedStatus = { ...currentState.lobby.status, ...status };

    // Update the lobby with the new status
    const updatedLobby = new Lobby({
      ...currentState.lobby,
      status: updatedStatus,
    });

    // Emit the updated lobby state
    this._lobbyState.next({
      ...currentState,
      lobby: updatedLobby,
    });
  }

  setHost(host: Member): void {
    const currentState = this._lobbyState.value;
    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({ ...currentState.lobby, host: new Member(host) }),
    });
  }

  setMembers(members: Map<string, Member>): void {
    const currentState = this._lobbyState.value;

    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({ ...currentState.lobby, members: new Map(members) }),
    });
  }

  addMember(member: Member): void {
    const currentState = this._lobbyState.value;
    const updatedMembers = new Map(currentState.lobby.members);
    updatedMembers.set(member.sessionId, new Member(member));

    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({ ...currentState.lobby, members: updatedMembers }),
    });
  }

  removeMember(member: Member): void {
    const currentState = this._lobbyState.value;
    const updatedMembers = new Map(currentState.lobby.members);
    updatedMembers.delete(member.sessionId);

    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({ ...currentState.lobby, members: updatedMembers }),
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._lobbyState.value;
    this._lobbyState.next({ ...currentState, isLoading });
  }
}
