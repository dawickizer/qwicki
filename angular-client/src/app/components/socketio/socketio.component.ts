import { Component, OnInit } from '@angular/core';
import { SocketioService } from '../../services/socketio/socketio.service';

@Component({
  selector: 'app-socketio',
  templateUrl: './socketio.component.html',
  styleUrls: ['./socketio.component.css']
})
export class SocketioComponent implements OnInit {

  constructor(private socketioService: SocketioService) {

  }

  ngOnInit() {
    this.socketioService.setupSocketConnection();
  }
}
