import { Injectable } from '@angular/core';
import * as Colyseus from 'colyseus.js';
import { User } from 'src/app/models/user/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ColyseusService {
  private _client = new Colyseus.Client(environment.COLYSEUS_SOCIAL);
  private _host: User;
  private _hostJWT: any;
  private _hostRoom: Colyseus.Room;
  private _rooms: Colyseus.Room[] = [];

  async establishHost(host: User, hostJWT: any) {
    this._host = new User(host);
    this._hostJWT = hostJWT;
    this._hostRoom = await this.createRoom(host);
  }

  async establishOnlineFriendsRooms() {
    await this.connectToRooms(this._host.onlineFriends);
  }

  async createRoom(user: User): Promise<Colyseus.Room> {
    try {
      let room: Colyseus.Room = await this.joinExistingRoomIfPresent(user);
      if (!room) {
        room = await this._client.create('social_room', {
          accessToken: this._hostJWT,
        });
        this._rooms.push(room);
      }
      return room;
    } catch (e) {
      console.error('join error', e);
      return null;
    }
  }

  async joinExistingRoomIfPresent(user: User): Promise<Colyseus.Room> {
    const availableRooms: Colyseus.RoomAvailable[] =
      await this._client.getAvailableRooms();
    const hasExistingRoom: boolean = availableRooms.some(
      (availableRoom: any) => availableRoom.roomId === user._id
    );
    let room: Colyseus.Room;
    if (hasExistingRoom) room = await this.connectToRoom(user);
    return room;
  }

  async connectToRoom(user: User): Promise<Colyseus.Room> {
    try {
      const room: Colyseus.Room = await this._client.joinById(user._id, {
        accessToken: this._hostJWT,
      });
      if (room) this._rooms.push(room);
      return room;
    } catch (e) {
      console.error('join error', e);
      return null;
    }
  }

  async connectToRooms(users: User[]): Promise<Colyseus.Room[]> {
    try {
      const promises: Promise<Colyseus.Room>[] = [];
      users.forEach(user => promises.push(this.connectToRoom(user)));
      return await Promise.all(promises);
    } catch (e) {
      console.error('join error', e);
      return null;
    }
  }

  removeRoomById(id: string) {
    this._rooms = this._rooms.filter((room: Colyseus.Room) => room.id !== id);
  }

  leaveRoom(room: Colyseus.Room) {
    this.removeRoomById(room.id);
    room.leave();
  }

  leaveRooms(rooms: Colyseus.Room[]) {
    rooms.forEach((room: Colyseus.Room) => this.leaveRoom(room));
  }

  leaveAllRooms() {
    this.leaveRooms(this._rooms);
  }

  debug(room: Colyseus.Room) {
    room.onStateChange(state => console.log(state));
  }

  get host(): User {
    return this._host;
  }

  set host(host: User) {
    this._host = host;
  }

  get hostJWT(): any {
    return this._hostJWT;
  }

  set hostJWT(hostJWT: any) {
    this._hostJWT = hostJWT;
  }

  get hostRoom(): Colyseus.Room {
    return this._hostRoom;
  }

  get rooms(): Colyseus.Room[] {
    return this._rooms;
  }

  get onlineFriendsRooms(): Colyseus.Room[] {
    return this._rooms.filter(room => room.id !== this._hostRoom.id);
  }
}
