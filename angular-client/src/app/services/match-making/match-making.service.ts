import { Injectable } from '@angular/core';
import * as Colyseus from 'colyseus.js';
import { Game } from 'src/app/models/game/game';
import { User } from 'src/app/models/user/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchMakingService {

  private _client = new Colyseus.Client(environment.COLYSEUS_GAME);
  private _self: User;
  private _selfJWT: any;
  private _gameRoom: Colyseus.Room;
  private _availableGameRooms: Colyseus.RoomAvailable[] = [];

  constructor() { }

  async createGameRoom(game: Game): Promise<Colyseus.Room> {
    this._gameRoom = await this._client.create("game_room", {accessToken: this._selfJWT, game: game});
    return this._gameRoom;
  }

  async getAvailableGameRooms(): Promise<Colyseus.RoomAvailable[]> {
    this._availableGameRooms = await this._client.getAvailableRooms("game_room");
    return this._availableGameRooms;
  }

  async joinGameRoom(roomId: string): Promise<Colyseus.Room> {
    this._gameRoom = await this._client.joinById(roomId, {accessToken: this._selfJWT});
    return this._gameRoom;
  }

  async leaveGameRoom(): Promise<number> {
    if (this._gameRoom) return this._gameRoom.leave();
    else return new Promise(() => -1);
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

  get gameRoom(): Colyseus.Room {
    return this._gameRoom
  }

  get availableGameRooms(): Colyseus.RoomAvailable[] {
    return this._availableGameRooms;
  }
}





