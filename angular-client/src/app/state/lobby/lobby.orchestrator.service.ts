import { Injectable } from '@angular/core';
import { Observable, tap, of } from 'rxjs';
import { Lobby } from './lobby.model';
import { LobbyService } from './lobby.service';
import { AuthService } from '../auth/auth.service';
import { LobbyMessage } from './lobby-message.model';
import { Member } from './member.model';
import { LobbyManagerService } from './lobby.manager.service';
import { DecodedJwt } from '../auth/decoded-jwt.model';
import { Activity } from 'src/app/types/activity/activity.type';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap } from 'src/app/types/game-map/game-map.type';

@Injectable({
  providedIn: 'root',
})
export class LobbyOrchestratorService {
  private lobby: Lobby;
  private jwt: string;
  private decodedJwt: DecodedJwt;

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
    this.authService.decodedJwt$.subscribe(
      decodedJwt => (this.decodedJwt = decodedJwt)
    );
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

  setRoute(route: string): Observable<string> {
    this.lobby.room.send('setRoute', route);
    return of(route);
  }

  setActivity(activity: Activity): Observable<Activity> {
    this.lobby.room.send('setActivity', activity);
    return of(activity);
  }

  setQueueType(queueType: QueueType): Observable<QueueType> {
    this.lobby.room.send('setQueueType', queueType);
    return of(queueType);
  }

  setGameType(gameType: GameType): Observable<GameType> {
    this.lobby.room.send('setGameType', gameType);
    return of(gameType);
  }

  setGameMode(gameMode: GameMode): Observable<GameMode> {
    this.lobby.room.send('setGameMode', gameMode);
    return of(gameMode);
  }

  setGameMap(gameMap: GameMap): Observable<GameMap> {
    this.lobby.room.send('setGameMap', gameMap);
    return of(gameMap);
  }

  toggleReady(member: Member): Observable<Member> {
    this.lobby.room.send('toggleReady', member);
    return of(member);
  }

  isHost(): boolean {
    return this.decodedJwt._id === this.lobby?.host?._id;
  }
}
