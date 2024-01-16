import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LobbyState, initialState } from './lobby.state';
import {
  activitySelector,
  gameTypeSelector,
  isLoadingSelector,
  queueTypeSelector,
  lobbySelector,
  hostSelector,
  membersSelector,
  messagesSelector,
  outboundInvitesSelector,
  isReadyByMemberSessionIdSelector,
  isReadySelector,
  gameModeSelector,
  gameMapSelector,
  routeSelector,
  idSelector,
} from './lobby.state.selectors';
import { Lobby } from './lobby.model';
import { Member } from 'src/app/state/lobby/member.model';
import { LobbyMessage } from './lobby-message.model';
import { Activity } from 'src/app/types/activity/activity.type';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap } from 'src/app/types/game-map/game-map.type';

@Injectable({
  providedIn: 'root',
})
export class LobbyStateService {
  private _lobbyState = new BehaviorSubject<LobbyState>(initialState);

  public lobbyState$: Observable<LobbyState> = this._lobbyState.asObservable();
  public isLoading$ = isLoadingSelector(this.lobbyState$);
  public lobby$ = lobbySelector(this.lobbyState$);
  public id$ = idSelector(this.lobby$);
  public isReady$ = isReadySelector(this.lobby$);
  public route$ = routeSelector(this.lobby$);
  public activity$ = activitySelector(this.lobby$);
  public queueType$ = queueTypeSelector(this.lobby$);
  public gameType$ = gameTypeSelector(this.lobby$);
  public gameMode$ = gameModeSelector(this.lobby$);
  public gameMap$ = gameMapSelector(this.lobby$);
  public host$ = hostSelector(this.lobby$);
  public members$ = membersSelector(this.lobby$);
  public messages$ = messagesSelector(this.lobby$);
  public outboundInvites$ = outboundInvitesSelector(this.lobby$);

  isReadyByMemberSessionId$(sessionId: string): Observable<boolean> {
    return isReadyByMemberSessionIdSelector(this.members$, sessionId);
  }

  setInitialState() {
    this._lobbyState.next(initialState);
  }

  setLobby(lobby: Lobby): void {
    const currentState = this._lobbyState.value;
    this._lobbyState.next({ ...currentState, lobby: new Lobby(lobby) });
  }

  setRoute(route: string): void {
    const currentState = this._lobbyState.value;
    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({ ...currentState.lobby, route }),
    });
  }

  setActivity(activity: Activity): void {
    const currentState = this._lobbyState.value;
    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({ ...currentState.lobby, activity }),
    });
  }

  setQueueType(queueType: QueueType): void {
    const currentState = this._lobbyState.value;
    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({ ...currentState.lobby, queueType }),
    });
  }

  setGameType(gameType: GameType): void {
    const currentState = this._lobbyState.value;
    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({ ...currentState.lobby, gameType }),
    });
  }

  setGameMode(gameMode: GameMode): void {
    const currentState = this._lobbyState.value;
    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({ ...currentState.lobby, gameMode }),
    });
  }

  setGameMap(gameMap: GameMap): void {
    const currentState = this._lobbyState.value;
    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({ ...currentState.lobby, gameMap }),
    });
  }

  setIsReady(isReady: boolean): void {
    const currentState = this._lobbyState.value;
    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({ ...currentState.lobby, isReady }),
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

  setMemberIsHost(member: Member, isHost: boolean): void {
    const currentState = this._lobbyState.value;

    // Deep copy the members and update the member's isHost property
    const updatedMembers = new Map<string, Member>();
    currentState.lobby.members.forEach((m, sessionId) => {
      updatedMembers.set(
        sessionId,
        sessionId === member.sessionId
          ? new Member({ ...m, isHost })
          : new Member(m)
      );
    });

    // Update the state with a new Lobby instance
    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({ ...currentState.lobby, members: updatedMembers }),
    });
  }

  setMemberIsReady(member: Member, isReady: boolean): void {
    const currentState = this._lobbyState.value;

    // Deep copy the members and update the member's isReady property
    const updatedMembers = new Map<string, Member>();
    currentState.lobby.members.forEach((m, sessionId) => {
      updatedMembers.set(
        sessionId,
        sessionId === member.sessionId
          ? new Member({ ...m, isReady })
          : new Member(m)
      );
    });

    // Update the state with a new Lobby instance
    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({ ...currentState.lobby, members: updatedMembers }),
    });
  }

  setMessages(messages: LobbyMessage[]): void {
    const currentState = this._lobbyState.value;
    if (!currentState.lobby) return;
    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({
        ...currentState.lobby,
        messages: [...messages].map(message => new LobbyMessage(message)),
      }),
    });
  }

  addMessage(message: LobbyMessage): void {
    const currentState = this._lobbyState.value;
    if (!currentState.lobby) return;

    const updatedMessages = [
      ...currentState.lobby.messages,
      new LobbyMessage(message),
    ];
    this._lobbyState.next({
      ...currentState,
      lobby: new Lobby({
        ...currentState.lobby,
        messages: updatedMessages.map(message => new LobbyMessage(message)),
      }),
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._lobbyState.value;
    this._lobbyState.next({ ...currentState, isLoading });
  }
}
