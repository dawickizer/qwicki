import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LobbyStateService } from './lobby.state.service';
import { Lobby } from './game.model';
import { Room } from 'colyseus.js';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { Status } from 'src/app/models/status/status.model';
import { LobbyMessage } from './lobby-message.model';
import { LobbyApiService } from './lobby.api.service';

@Injectable({
  providedIn: 'root',
})
export class LobbyEffectService {
  constructor(
    private lobbyStateService: LobbyStateService,
    private lobbyApiService: LobbyApiService,
    private colyseusService: ColyseusService,
    private snackBar: MatSnackBar
  ) {}

  createLobby(options: { jwt: string }): Observable<Lobby> {
    this.lobbyStateService.setIsLoading(true);
    return from(this.colyseusService.createRoom('game', 'lobby', options)).pipe(
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
      tap(() => this.lobbyStateService.setIsLoading(false)),
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

  sendMessage(message: LobbyMessage): Observable<LobbyMessage> {
    return this.lobbyApiService.sendMessage(message).pipe(
      tap(message => {
        this.lobbyStateService.addMessage(message);
      }),
      catchError(this.handleError)
    );
  }

  private handleConnectedLobbySuccess = (lobby: Lobby) => {
    this.lobbyStateService.setLobby(lobby);
    this.lobbyStateService.setIsLoading(false);
  };

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.lobbyStateService.setIsLoading(false);
    return of(null);
  };
}
