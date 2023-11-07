import { Injectable } from '@angular/core';
import * as Colyseus from 'colyseus.js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ColyseusService {
  private _client = new Colyseus.Client(environment.COLYSEUS_SOCIAL);

  async createRoom(roomId: string, options: any): Promise<Colyseus.Room> {
    try {
      let room: Colyseus.Room = await this.joinExistingRoomIfPresent(
        roomId,
        options
      );
      if (!room) {
        room = await this._client.create('inbox', options);
      }
      return room;
    } catch (e) {
      console.error('join error', e);
      return null;
    }
  }

  async joinExistingRoomIfPresent(
    roomId: string,
    options: any
  ): Promise<Colyseus.Room> {
    const availableRooms: Colyseus.RoomAvailable[] =
      await this._client.getAvailableRooms();
    const hasExistingRoom: boolean = availableRooms.some(
      (availableRoom: any) => availableRoom.roomId === roomId
    );
    let room: Colyseus.Room;
    if (hasExistingRoom) room = await this.connectToRoom(roomId, options);
    return room;
  }

  async joinExistingRoomsIfPresent(
    roomIds: string[],
    options: any
  ): Promise<Colyseus.Room[]> {
    // Fetch available rooms
    const availableRooms: Colyseus.RoomAvailable[] =
      await this._client.getAvailableRooms();

    // Filter out roomIds from the provided array that match the available rooms.
    const roomIdsToJoin: string[] = roomIds.filter(roomId =>
      availableRooms.some(availableRoom => availableRoom.roomId === roomId)
    );

    if (roomIdsToJoin.length === 0) return [];

    // Connect to the identified rooms.
    const connectedRooms: Colyseus.Room[] = await this.connectToRooms(
      roomIdsToJoin,
      options
    );

    return connectedRooms;
  }

  async connectToRoom(roomId: string, options: any): Promise<Colyseus.Room> {
    try {
      const room: Colyseus.Room = await this._client.joinById(roomId, options);
      return room;
    } catch (e) {
      console.error('join error', e);
      return null;
    }
  }

  async connectToRooms(
    roomIds: string[],
    options: any
  ): Promise<Colyseus.Room[]> {
    try {
      const promises: Promise<Colyseus.Room>[] = [];
      roomIds.forEach(roomId =>
        promises.push(this.connectToRoom(roomId, options))
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
}
