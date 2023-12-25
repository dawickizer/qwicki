import { Injectable } from '@angular/core';
import * as Colyseus from 'colyseus.js';
import { ClientType } from 'src/app/types/client-type/client-type.type';
import { RoomName } from 'src/app/types/room-name/room-name.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ColyseusService {
  private _clients = new Map<ClientType, Colyseus.Client>();

  constructor() {
    this._clients.set(
      'social',
      new Colyseus.Client(environment.COLYSEUS_SOCIAL)
    );
    this._clients.set('game', new Colyseus.Client(environment.COLYSEUS_GAME));
  }

  async createRoomWithId(
    clientType: ClientType,
    roomName: RoomName,
    roomId: string,
    options: any
  ): Promise<Colyseus.Room> {
    try {
      const client = this.getClient(clientType);
      let room: Colyseus.Room = await this.joinExistingRoomIfPresent(
        clientType,
        roomId,
        options
      );
      if (!room) {
        room = await client.create(roomName, options);
      }
      return room;
    } catch (e) {
      console.error('join error', e);
      return null;
    }
  }

  async createRoom(
    clientType: ClientType,
    roomName: RoomName,
    options: any
  ): Promise<Colyseus.Room> {
    try {
      const client = this.getClient(clientType);
      const room = await client.create(roomName, options);
      return room;
    } catch (e) {
      console.error('join error', e);
      return null;
    }
  }

  async joinExistingRoomIfPresent(
    clientType: ClientType,
    roomId: string,
    options: any
  ): Promise<Colyseus.Room> {
    const client = this.getClient(clientType);
    const availableRooms: Colyseus.RoomAvailable[] =
      await client.getAvailableRooms();
    const hasExistingRoom: boolean = availableRooms.some(
      (availableRoom: any) => availableRoom.roomId === roomId
    );
    let room: Colyseus.Room;
    if (hasExistingRoom)
      room = await this.connectToRoom(clientType, roomId, options);
    return room;
  }

  async joinExistingRoomsIfPresent(
    clientType: ClientType,
    roomIds: string[],
    options: any
  ): Promise<Colyseus.Room[]> {
    // Fetch available rooms
    const client = this.getClient(clientType);
    const availableRooms: Colyseus.RoomAvailable[] =
      await client.getAvailableRooms();

    // Filter out roomIds from the provided array that match the available rooms.
    const roomIdsToJoin: string[] = roomIds.filter(roomId =>
      availableRooms.some(availableRoom => availableRoom.roomId === roomId)
    );

    if (roomIdsToJoin.length === 0) return [];

    // Connect to the identified rooms.
    const connectedRooms: Colyseus.Room[] = await this.connectToRooms(
      clientType,
      roomIdsToJoin,
      options
    );

    return connectedRooms;
  }

  async connectToRoom(
    clientType: ClientType,
    roomId: string,
    options: any
  ): Promise<Colyseus.Room> {
    try {
      const client = this.getClient(clientType);
      const room: Colyseus.Room = await client.joinById(roomId, options);
      return room;
    } catch (e) {
      console.error('join error', e);
      return null;
    }
  }

  async connectToRooms(
    clientType: ClientType,
    roomIds: string[],
    options: any
  ): Promise<Colyseus.Room[]> {
    try {
      const promises: Promise<Colyseus.Room>[] = [];
      roomIds.forEach(roomId =>
        promises.push(this.connectToRoom(clientType, roomId, options))
      );

      const connectedRooms: Colyseus.Room[] = await Promise.all(promises);
      return connectedRooms.filter(room => room !== null);
    } catch (e) {
      console.error('join error', e);
      return null;
    }
  }

  leaveRoom(room: Colyseus.Room): Promise<number> {
    return room ? room.leave() : Promise.resolve(-1);
  }

  leaveRooms(rooms: Colyseus.Room[]): Promise<number[]> {
    const leavePromises = rooms.map((room: Colyseus.Room) =>
      this.leaveRoom(room)
    );
    return Promise.all(leavePromises);
  }

  private getClient(clientType: ClientType): Colyseus.Client {
    return this._clients.get(clientType);
  }
}
