import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket: SocketIOClient.Socket;

  constructor() { }

  setupSocketConnection(): SocketIOClient.Socket {
    return this.socket = io(environment.EXPRESS_SERVER, {
      query: {
        token: 'cde'
      }
    });
  }
}
