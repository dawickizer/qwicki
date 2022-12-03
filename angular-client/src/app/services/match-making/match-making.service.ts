import { Injectable } from '@angular/core';
import * as Colyseus from 'colyseus.js';
import { User } from 'src/app/models/user/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchMakingService {

  private _client = new Colyseus.Client(environment.COLYSEUS_GAME);
  private _self: User;
  private _selfJWT: any;
  private _game: Colyseus.Room;
  private _availableGames: Colyseus.RoomAvailable[] = [];

  constructor() { }

  async createGame(): Promise<Colyseus.Room> {
    this._game = await this._client.create("game_room", {accessToken: this._selfJWT});
    return this._game;
  }

  async getAvailableGames(): Promise<Colyseus.RoomAvailable[]> {
    this._availableGames = await this._client.getAvailableRooms("game_room");
    return this._availableGames;
  }

  async joinGame(roomId: string): Promise<Colyseus.Room> {
    this._game = await this._client.joinById(roomId, {accessToken: this._selfJWT});
    return this._game;
  }

  async leaveGame(room: Colyseus.Room): Promise<number> {
    return room.leave();
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

  get selfJWT(): User {
    return this._selfJWT;
  }

  set selfJWT(selfJWT: any) {
    this._selfJWT = selfJWT;
  }

  get game(): Colyseus.Room {
    return this._game
  }

  get availableGames(): Colyseus.RoomAvailable[] {
    return this._availableGames;
  }
}





