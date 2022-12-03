import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';
import * as Colyseus from 'colyseus.js';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @Input() self: User;
  @Input() selfJWT: any

  public availableGamesDisplayedColumns: string[] = ['name', 'action'];
  public availableGames = new MatTableDataSource<Colyseus.RoomAvailable>([] as Colyseus.RoomAvailable[]);

  constructor(private router: Router, public matchMakingService: MatchMakingService) {}

  ngOnInit() {
    this.setSelf();
    this.getAvailableGames();
  }

  setSelf() {
    this.matchMakingService.self = this.self;
    this.matchMakingService.selfJWT = this.selfJWT;
  }

  async getAvailableGames() {
    this.availableGames.data = await this.matchMakingService.getAvailableGames();
    console.log(this.availableGames);
  }

  async createGame() {
    await this.matchMakingService.createGame();
    this.router.navigate(["/babylonjs"]);
  }

  async joinGame(game: Colyseus.RoomAvailable) {
    await this.matchMakingService.joinGame(game.roomId);
    this.router.navigate(["/babylonjs"]);
  }
}
