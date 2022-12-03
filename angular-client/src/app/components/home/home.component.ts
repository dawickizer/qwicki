import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';
import * as Colyseus from 'colyseus.js';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Game } from 'src/app/models/game/game';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @Input() self: User;
  @Input() selfJWT: any

  constructor(private router: Router, public matchMakingService: MatchMakingService) {}

  ngOnInit() {
    this.setSelf();
  }

  setSelf() {
    this.matchMakingService.self = this.self;
    this.matchMakingService.selfJWT = this.selfJWT;
  }
}
