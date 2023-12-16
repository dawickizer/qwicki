import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LobbyStateService } from './lobby.state.service';
import { Lobby } from './lobby.model';
import { Room } from 'colyseus.js';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { Member } from 'src/app/state/lobby/member.model';
import { Status } from 'src/app/models/status/status.model';
import { LobbyMessage } from './lobby-message.model';
import { LobbyApiService } from './lobby.api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LobbyEffectService {
  private joinLobbyAudio = new Audio('assets/notifications/sounds/join.mp3');
  private leaveLobbyAudio = new Audio('assets/notifications/sounds/leave.mp3');

  constructor(
    private lobbyStateService: LobbyStateService,
    private lobbyApiService: LobbyApiService,
    private colyseusService: ColyseusService,
    private router: Router,
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

  sendMessage(message: LobbyMessage): Observable<LobbyMessage> {
    return this.lobbyApiService.sendMessage(message).pipe(
      tap(message => {
        this.lobbyStateService.addMessage(message);
      }),
      catchError(this.handleError)
    );
  }

  private handleConnectedLobbySuccess = (lobby: Lobby) => {
    if (lobby?.room) {
      this.lobbyStateService.setLobby(lobby);

      lobby.room.state.host.onChange = () => {
        this.lobbyStateService.setHost(lobby.room.state.host);
      };

      lobby.room.state.members.onAdd = (member: Member | any) => {
        member.listen('isHost', (current: boolean) => {
          this.lobbyStateService.setMemberIsHost(member, current);
        });

        this.joinLobbyAudio.play();
        this.lobbyStateService.addMember(member);
      };

      lobby.room.state.members.onRemove = (member: Member) => {
        this.leaveLobbyAudio.play();
        this.lobbyStateService.removeMember(member);
      };

      lobby.room.state.messages.onAdd = (message: LobbyMessage) => {
        this.lobbyStateService.addMessage(message);
      };

      lobby.room.onLeave(() => {
        // TODO:
        // I leave my own lobby (I am host)
        // I need to transfer host if others in my lobby (backend)
        // I need to remove the lobby from my state (frontend)
        // I need to create and connect to my own lobby (frontend)
        // I leave someone elses lobby (I am not host)
        // I need to remove the lobby from my state (frontend)
        // I need to create and connect to my own lobby (frontend)
        // I get kicked from someone elses lobby
        // I need to remove the lobby from my state (frontend)
        // I need to create and connect to my own lobby (frontend)

        this.lobbyStateService.setInitialState();
        this.router.navigate(['/dashboard']);
      });

      lobby.room.onMessage('transferHost', (host: Member) => {
        this.joinLobbyAudio.play();
        this.snackBar.open(`${host.username} is now the host!`, 'Dismiss', {
          duration: 5000,
        });
      });

      lobby.room.onMessage('kickMember', (member: Member) => {
        this.snackBar.open(
          `${member.username} was kicked from the lobby!`,
          'Dismiss',
          { duration: 5000 }
        );
      });
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
