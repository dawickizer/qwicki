import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';
import * as Colyseus from 'colyseus.js';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent implements OnInit {

  public availableGamesDisplayedColumns: string[] = ['name', 'mode', 'map', 'action'];
  public availableGames = new MatTableDataSource<Colyseus.RoomAvailable>([] as Colyseus.RoomAvailable[]);

  constructor(private router: Router, public matchMakingService: MatchMakingService) { }

  ngOnInit(): void {
    this.getAvailableGames();
  }

  async getAvailableGames() {
    this.availableGames.data = await this.matchMakingService.getAvailableGames();
  }

  async joinGame(game: Colyseus.RoomAvailable) {
    await this.matchMakingService.joinGame(game.roomId);
    this.router.navigate(["/babylonjs"]);
  }

}
