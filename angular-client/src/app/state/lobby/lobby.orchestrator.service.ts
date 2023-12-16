import { Injectable } from '@angular/core';
import { Observable, tap, of } from 'rxjs';
import { Lobby } from './lobby.model';
import { LobbyService } from './lobby.service';
import { DecodedJwt } from '../auth/decoded-jwt.model';
import { AuthService } from '../auth/auth.service';
import { LobbyMessage } from './lobby-message.model';
import { Member } from './member.model';

@Injectable({
  providedIn: 'root',
})
export class LobbyOrchestratorService {
  private lobby: Lobby;
  private decodedJwt: DecodedJwt;
  private jwt: string;

  constructor(
    private lobbyService: LobbyService,
    private authService: AuthService
  ) {
    this.subscribeToState();
  }

  private subscribeToState() {
    this.lobbyService.lobby$.subscribe(lobby => (this.lobby = lobby));
    this.authService.decodedJwt$.subscribe(
      decodedJwt => (this.decodedJwt = decodedJwt)
    );
    this.authService.jwt$.subscribe(jwt => (this.jwt = jwt));
  }

  createLobby(): Observable<Lobby> {
    if (this.lobby?.room) {
      console.log('ALREADY A LOBBY...returning it');
      console.log(this.lobby);
      return of(this.lobby);
    }
    return this.lobbyService.createLobby({ jwt: this.jwt });
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

  transferHost(member: Member): Observable<Member> {
    this.lobby.room.send('transferHost', member);
    return of(member);
  }
}
