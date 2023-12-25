import { Injectable } from '@angular/core';
import { Observable, tap, of } from 'rxjs';
import { Game } from './game.model';
import { GameService } from './game.service';
import { AuthService } from '../auth/auth.service';
import { GameMessage } from './game-message.model';
import { Player } from './player.model';
import { GameManagerService } from './game.manager.service';
import { Status } from 'src/app/models/status/status.model';
import { DecodedJwt } from '../auth/decoded-jwt.model';

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

  updateStatus(status: Partial<Status>): Observable<Status> {
    this.game.room.send('updateStatus', status);
    return of(status as Status);
  }

  toggleReady(player: Player): Observable<Player> {
    this.game.room.send('toggleReady', player);
    return of(player);
  }

  isHost(): boolean {
    return this.decodedJwt._id === this.game?.host?._id;
  }
}
