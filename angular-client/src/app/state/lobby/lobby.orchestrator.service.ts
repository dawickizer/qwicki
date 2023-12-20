import { Injectable } from '@angular/core';
import { Observable, tap, of } from 'rxjs';
import { Lobby } from './lobby.model';
import { LobbyService } from './lobby.service';
import { AuthService } from '../auth/auth.service';
import { LobbyMessage } from './lobby-message.model';
import { Member } from './member.model';
import { LobbyManagerService } from './lobby.manager.service';
import { Status } from 'src/app/models/status/status.model';

@Injectable({
  providedIn: 'root',
})
export class LobbyOrchestratorService {
  private lobby: Lobby;
  private jwt: string;

  constructor(
    private lobbyService: LobbyService,
    private lobbyManagerService: LobbyManagerService,
    private authService: AuthService
  ) {
    this.subscribeToState();
  }

  private subscribeToState() {
    this.lobbyService.lobby$.subscribe(lobby => (this.lobby = lobby));
    this.authService.jwt$.subscribe(jwt => (this.jwt = jwt));
  }

  createLobby(): Observable<Lobby> {
    if (this.lobby?.room) {
      return of(this.lobby);
    }
    return this.lobbyService.createLobby({ jwt: this.jwt }).pipe(
      tap(lobby => {
        if (lobby?.room) {
          this.lobbyManagerService.setListeners(lobby);
        }
      })
    );
  }

  sendMessage(message: LobbyMessage): Observable<LobbyMessage> {
    this.lobby.room.send('sendMessage', message);
    return of(null);

    // TODO: handle API/DB persistence of lobby messages if i want
    return this.lobbyService.sendMessage(message).pipe(
      tap(message => {
        this.lobby.room.send('sendMessage', message);
      })
    );
  }

  kickMember(member: Member): Observable<Member> {
    this.lobby.room.send('kickMember', member);
    return of(member);
  }

  leaveLobby(): Observable<boolean> {
    this.lobby.room.send('leaveLobby');
    return of(true);
  }

  transferHost(member: Member): Observable<Member> {
    this.lobby.room.send('transferHost', member);
    return of(member);
  }

  updateStatus(status: Partial<Status>): Observable<Status> {
    this.lobby.room.send('updateStatus', status);
    return of(status as Status);
  }
}
