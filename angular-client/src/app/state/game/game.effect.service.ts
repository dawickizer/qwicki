import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameStateService } from './game.state.service';
import { Game } from './game.model';
import { Room } from 'colyseus.js';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { GameMessage } from './game-message.model';
import { GameApiService } from './game.api.service';

@Injectable({
  providedIn: 'root',
})
export class GameEffectService {
  constructor(
    private gameStateService: GameStateService,
    private gameApiService: GameApiService,
    private colyseusService: ColyseusService,
    private snackBar: MatSnackBar
  ) {}

  createGame(options: { jwt: string }): Observable<Game> {
    this.gameStateService.setIsLoading(true);
    return from(
      this.colyseusService.createRoom('game', 'custom-game', options)
    ).pipe(
      map(
        game =>
          new Game({
            _id: game.id,
            room: game,
            players: new Map(),
            outboundInvites: [],
            messages: [],
            teams: new Map(),
          })
      ),
      tap(this.handleConnectedGameSuccess),
      catchError(this.handleError)
    );
  }

  leaveGame(game: Room): Observable<number> {
    this.gameStateService.setIsLoading(true);
    return from(this.colyseusService.leaveRoom(game)).pipe(
      tap(() => this.gameStateService.setIsLoading(false)),
      catchError(this.handleError)
    );
  }

  connectToGame(gameId: string, options: { jwt: string }): Observable<Game> {
    this.gameStateService.setIsLoading(true);
    return from(
      this.colyseusService.connectToRoom('game', gameId, options)
    ).pipe(
      map(
        game =>
          new Game({
            _id: game.id,
            room: game,
            players: new Map(),
            outboundInvites: [],
            messages: [],
            teams: new Map(),
          })
      ),
      tap(this.handleConnectedGameSuccess),
      catchError(this.handleError)
    );
  }

  joinExistingGameIfPresent(
    gameId: string,
    options: { jwt: string }
  ): Observable<Game> {
    this.gameStateService.setIsLoading(true);
    return from(
      this.colyseusService.joinExistingRoomIfPresent('game', gameId, options)
    ).pipe(
      map(
        game =>
          new Game({
            _id: game.id,
            room: game,
            players: new Map(),
            outboundInvites: [],
            messages: [],
            teams: new Map(),
          })
      ),
      tap(this.handleConnectedGameSuccess),
      catchError(this.handleError)
    );
  }

  sendMessage(message: GameMessage): Observable<GameMessage> {
    return this.gameApiService.sendMessage(message).pipe(
      tap(message => {
        this.gameStateService.addMessage(message);
      }),
      catchError(this.handleError)
    );
  }

  private handleConnectedGameSuccess = (game: Game) => {
    this.gameStateService.setGame(game);
    this.gameStateService.setIsLoading(false);
  };

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.gameStateService.setIsLoading(false);
    return of(null);
  };
}
