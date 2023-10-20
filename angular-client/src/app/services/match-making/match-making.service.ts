import { Injectable } from '@angular/core';
import * as Colyseus from 'colyseus.js';
import { Game } from 'src/app/models/game/game';
import { User } from 'src/app/state/user/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MatchMakingService {
  private _client = new Colyseus.Client(environment.COLYSEUS_GAME);
  private _self: User;
  private _selfJWT: any;
  private _game: Game = new Game();
  private _gameRoomId: string;
  private _availableGameRooms: Colyseus.RoomAvailable[] = [];

  async getAvailableGameRooms(): Promise<Colyseus.RoomAvailable[]> {
    this._availableGameRooms =
      await this._client.getAvailableRooms('game_room');
    return this._availableGameRooms;
  }

  async createGameRoom(): Promise<Colyseus.Room> {
    this._game.room = await this._client.create('game_room', {
      accessToken: this._selfJWT,
      game: this.game,
    });
    this._gameRoomId = this._game.room.id;
    return this._game.room;
  }

  async joinGameRoom(): Promise<Colyseus.Room> {
    this._game.room = await this._client.joinById(this._gameRoomId, {
      accessToken: this._selfJWT,
    });
    this._gameRoomId = this._game.room.id;
    return this._game.room;
  }

  async leaveGameRoom(): Promise<number> {
    let promise: Promise<number> = new Promise(() => -1);
    if (this._game && this._game.room) promise = this._game.room.leave();
    this.game.room = null;
    this.gameRoomId = null;
    return promise;
  }

  debug(room: Colyseus.Room) {
    room.onStateChange(state => console.log(state));
  }

  get self(): User {
    return this._self;
  }

  set self(self: User) {
    this._self = self;
  }

  get selfJWT(): any {
    return this._selfJWT;
  }

  set selfJWT(selfJWT: any) {
    this._selfJWT = selfJWT;
  }

  get game(): Game {
    return this._game;
  }

  set game(game: Game) {
    this._game = game;
  }

  get gameRoomId(): string {
    return this._gameRoomId;
  }

  set gameRoomId(gameRoomId: string) {
    this._gameRoomId = gameRoomId;
  }

  get availableGameRooms(): Colyseus.RoomAvailable[] {
    return this._availableGameRooms;
  }
}
