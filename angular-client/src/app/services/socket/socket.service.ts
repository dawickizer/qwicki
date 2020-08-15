import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket;

  constructor() { }

  setupSocketConnection() {
    this.socket = io(environment.EXPRESS_ENDPOINT, {
      query: {
        token: 'cde'
      }
    });
    this.socket.emit('my message', 'Hello there from Angular.');
    this.socket.on('my broadcast', (data: string) => {
      console.log(data);
    });
  }
}
