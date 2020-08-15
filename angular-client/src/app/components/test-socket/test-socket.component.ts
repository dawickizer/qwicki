import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket/socket.service';

@Component({
  selector: 'app-test-socket',
  templateUrl: './test-socket.component.html',
  styleUrls: ['./test-socket.component.css']
})
export class TestSocketComponent implements OnInit {

  constructor(private socketService: SocketService) {

  }

  ngOnInit() {
    this.socketService.setupSocketConnection();
  }
}
