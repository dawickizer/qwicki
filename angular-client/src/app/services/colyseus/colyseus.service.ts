import { Injectable } from '@angular/core';
import * as Colyseus from 'colyseus.js';
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

  async createRoom(
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
    return room.leave();
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

export type ClientType = 'social' | 'game';
export type RoomName = 'inbox' | 'lobby';
