import { Injectable } from '@angular/core';
import { Observable, tap, of } from 'rxjs';
import { Game } from './game.model';
import { GameService } from './game.service';
import { AuthService } from '../auth/auth.service';
import { GameMessage } from './game-message.model';
import { Player } from './player.model';
import { GameManagerService } from './game.manager.service';
import { DecodedJwt } from '../auth/decoded-jwt.model';
import { Activity } from 'src/app/types/activity/activity.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap } from 'src/app/types/game-map/game-map.type';
import { MaxPlayerCount } from 'src/app/types/max-player-count/max-player-count.type';
import { Visibility } from 'src/app/types/visibility/visibility.type';

@Injectable({
  providedIn: 'root',
})
export class GameOrchestratorService {
  private game: Game;
  private jwt: string;
  private decodedJwt: DecodedJwt;

  constructor(
    private gameService: GameService,
    private gameManagerService: GameManagerService,
    private authService: AuthService
  ) {
    this.subscribeToState();
  }

  private subscribeToState() {
    this.gameService.game$.subscribe(game => (this.game = game));
    this.authService.jwt$.subscribe(jwt => (this.jwt = jwt));
    this.authService.decodedJwt$.subscribe(
      decodedJwt => (this.decodedJwt = decodedJwt)
    );
  }

  createGame(): Observable<Game> {
    if (this.game?.room) {
      return of(this.game);
    }
    return this.gameService.createGame({ jwt: this.jwt }).pipe(
      tap(game => {
        if (game?.room) {
          this.gameManagerService.setListeners(game);
        }
      })
    );
  }

  sendMessage(message: GameMessage): Observable<GameMessage> {
    this.game.room.send('sendMessage', message);
    return of(null);

    // TODO: handle API/DB persistence of game messages if i want
    return this.gameService.sendMessage(message).pipe(
      tap(message => {
        this.game.room.send('sendMessage', message);
      })
    );
  }

  kickPlayer(player: Player): Observable<Player> {
    this.game.room.send('kickPlayer', player);
    return of(player);
  }

  leaveGame(): Observable<boolean> {
    this.game.room.send('leaveGame');
    return of(true);
  }

  transferHost(player: Player): Observable<Player> {
    this.game.room.send('transferHost', player);
    return of(player);
  }

  setRoute(route: string): Observable<string> {
    this.game.room.send('setRoute', route);
    return of(route);
  }

  setActivity(activity: Activity): Observable<Activity> {
    this.game.room.send('setActivity', activity);
    return of(activity);
  }

  setGameType(gameType: GameType): Observable<GameType> {
    this.game.room.send('setGameType', gameType);
    return of(gameType);
  }

  setGameMode(gameMode: GameMode): Observable<GameMode> {
    this.game.room.send('setGameMode', gameMode);
    return of(gameMode);
  }

  setGameMap(gameMap: GameMap): Observable<GameMap> {
    this.game.room.send('setGameMap', gameMap);
    return of(gameMap);
  }

  setMaxPlayerCount(
    maxPlayerCount: MaxPlayerCount
  ): Observable<MaxPlayerCount> {
    this.game.room.send('setMaxPlayerCount', maxPlayerCount);
    return of(maxPlayerCount);
  }

  setVisibility(visibility: Visibility): Observable<Visibility> {
    this.game.room.send('setVisibility', visibility);
    return of(visibility);
  }

  setName(name: string): Observable<string> {
    this.game.room.send('setName', name);
    return of(name);
  }

  toggleReady(player: Player): Observable<Player> {
    this.game.room.send('toggleReady', player);
    return of(player);
  }

  isHost(): boolean {
    return this.decodedJwt._id === this.game?.host?._id;
  }
}
