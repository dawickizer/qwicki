import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LobbyStateService } from './lobby.state.service';
import { Lobby } from './lobby.model';
import { Room } from 'colyseus.js';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { Member } from 'src/app/models/member/member';
import { Status } from 'src/app/models/status/status.model';

@Injectable({
  providedIn: 'root',
})
export class LobbyEffectService {
  constructor(
    private lobbyStateService: LobbyStateService,
    private colyseusService: ColyseusService,
    private snackBar: MatSnackBar
  ) {}

  createLobby(lobbyId: string, options: { jwt: string }): Observable<Lobby> {
    this.lobbyStateService.setIsLoading(true);
    return from(
      this.colyseusService.createRoom('game', 'lobby', lobbyId, options)
    ).pipe(
      map(
        lobby =>
          new Lobby({
            _id: lobby.id,
            room: lobby,
            status: new Status({}),
            host: null,
            members: new Map(),
            outboundInvites: [],
            messages: [],
          })
      ),
      tap(this.handleConnectedLobbySuccess),
      catchError(this.handleError)
    );
  }

  leaveLobby(lobby: Room): Observable<number> {
    this.lobbyStateService.setIsLoading(true);
    return from(this.colyseusService.leaveRoom(lobby)).pipe(
      tap(() => {
        this.lobbyStateService.setLobby(null);
        this.lobbyStateService.setIsLoading(false);
      }),
      catchError(this.handleError)
    );
  }

  connectToLobby(lobbyId: string, options: { jwt: string }): Observable<Lobby> {
    this.lobbyStateService.setIsLoading(true);
    return from(
      this.colyseusService.connectToRoom('game', lobbyId, options)
    ).pipe(
      map(
        lobby =>
          new Lobby({
            _id: lobby.id,
            room: lobby,
            status: new Status({}),
            host: null,
            members: new Map(),
            outboundInvites: [],
            messages: [],
          })
      ),
      tap(this.handleConnectedLobbySuccess),
      catchError(this.handleError)
    );
  }

  joinExistingLobbyIfPresent(
    lobbyId: string,
    options: { jwt: string }
  ): Observable<Lobby> {
    this.lobbyStateService.setIsLoading(true);
    return from(
      this.colyseusService.joinExistingRoomIfPresent('game', lobbyId, options)
    ).pipe(
      map(
        lobby =>
          new Lobby({
            _id: lobby.id,
            room: lobby,
            status: new Status({}),
            host: null,
            members: new Map(),
            outboundInvites: [],
            messages: [],
          })
      ),
      tap(this.handleConnectedLobbySuccess),
      catchError(this.handleError)
    );
  }

  private handleConnectedLobbySuccess = (lobby: Lobby) => {
    if (lobby?.room) {
      this.lobbyStateService.setLobby(lobby);

      lobby.room.state.host.onChange = () => {
        console.log('state.host.onChange');
        console.log(lobby.room.state.host);
        this.lobbyStateService.setHost(lobby.room.state.host);
      };

      lobby.room.state.members.onAdd = (member: Member, key: string) => {
        console.log('state.members.onAdd');
        console.log(member.username, 'has been added at', key);
        this.lobbyStateService.addMember(member);
      };

      lobby.room.state.members.onRemove = (member: Member, key: string) => {
        console.log('state.members.onRemove');
        console.log(member.username, 'has been removed at', key);
        this.lobbyStateService.removeMember(member);
      };
    }
    this.lobbyStateService.setIsLoading(false);
  };

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.lobbyStateService.setIsLoading(false);
    return of(null);
  };
}
