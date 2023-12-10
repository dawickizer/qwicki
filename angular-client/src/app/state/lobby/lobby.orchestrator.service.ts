import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lobby } from './lobby.model';
import { LobbyService } from './lobby.service';
import { DecodedJwt } from '../auth/decoded-jwt.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LobbyOrchestratorService {
  private decodedJwt: DecodedJwt;
  private jwt: string;

  constructor(
    private lobbyService: LobbyService,
    private authService: AuthService
  ) {
    this.subscribeToState();
  }

  private subscribeToState() {
    this.authService.decodedJwt$.subscribe(
      decodedJwt => (this.decodedJwt = decodedJwt)
    );
    this.authService.jwt$.subscribe(jwt => (this.jwt = jwt));
  }

  createLobby(): Observable<Lobby> {
    return this.lobbyService.createLobby(this.decodedJwt._id, {
      jwt: this.jwt,
    });
  }
}
