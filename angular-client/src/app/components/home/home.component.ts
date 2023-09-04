import { Component, OnInit } from '@angular/core';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';
import { Router } from '@angular/router';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private colyseusService: ColyseusService,
    public matchMakingService: MatchMakingService
  ) {}

  ngOnInit() {
    this.setSelf();
  }

  setSelf() {
    this.matchMakingService.self = this.colyseusService.host;
    this.matchMakingService.selfJWT = this.colyseusService.hostJWT;
  }
}
