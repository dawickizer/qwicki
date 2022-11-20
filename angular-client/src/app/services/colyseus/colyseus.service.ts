import { Injectable, OnInit } from '@angular/core';
import * as Colyseus from 'colyseus.js';
import { User } from 'src/app/models/user/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColyseusService implements OnInit {

  public client = new Colyseus.Client(environment.COLYSEUS_CHAT);
  public rooms: Colyseus.Room[] = [];

  constructor() { }

  ngOnInit() {}

  async createRoom(user: User, userJWT: any): Promise<Colyseus.Room> {
    try {
      let room: Colyseus.Room = await this.joinExistingRoomIfPresent(user, userJWT);
      if (!room) {
        room = await this.client.create("chat_room", {accessToken: userJWT});
        this.rooms.push(room);
      }
      return room;
    } catch (e) {
      console.error("join error", e);
      return null;
    }
  }

  async joinExistingRoomIfPresent(user: User, userJWT: any): Promise<Colyseus.Room> {
    let availableRooms: Colyseus.RoomAvailable[] = await this.client.getAvailableRooms();
    let hasExistingRoom: boolean = availableRooms.some((availableRoom: any) => availableRoom.roomId === user._id);
    let room: Colyseus.Room;
    if (hasExistingRoom) room = await this.connectToRoom(user, userJWT);
    return room;
  }

  async connectToRoom(user: User, userJWT: any): Promise<Colyseus.Room> {
    try {
      let room: Colyseus.Room = await this.client.joinById(user._id, {accessToken: userJWT});
      if (room) this.rooms.push(room);
      return room;
    } catch (e) {
      console.error("join error", e);
      return null;
    }
  }

  async connectToRooms(users: User[], userJWT: any): Promise<Colyseus.Room[]> {
    try {
      let promises: Promise<Colyseus.Room>[] = [];
      users.forEach(user => promises.push(this.connectToRoom(user, userJWT)));
      return await Promise.all(promises);
    } catch (e) {
      console.error("join error", e);
      return null;
    }
  }

  removeRoomById(id: string) {
    this.rooms = this.rooms.filter((room: Colyseus.Room) => room.id !== id);
  }

  leaveRoom(room: Colyseus.Room) {
    this.removeRoomById(room.id);
    room.leave();
  }

  leaveRooms(rooms: Colyseus.Room[]) {
    rooms.forEach((room: Colyseus.Room) => this.leaveRoom(room));
  }

  leaveAllRooms() {
    this.leaveRooms(this.rooms);
  }

  debug(room: Colyseus.Room) {
    room.onStateChange(state => console.log(state));
  }
}





