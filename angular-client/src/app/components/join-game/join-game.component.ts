import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';
import * as Colyseus from 'colyseus.js';
import { Game } from 'src/app/models/game/game';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent implements OnInit {

  public availableGamesDisplayedColumns: string[] = ['name', 'mode', 'map', 'action'];
  public availableGames = new MatTableDataSource<Colyseus.RoomAvailable>([] as Colyseus.RoomAvailable[]);

  constructor(private router: Router, public matchMakingService: MatchMakingService) { }

  async ngOnInit() {
    this.getAvailableGames();
  }

  async getAvailableGames() {
    this.availableGames.data = await this.matchMakingService.getAvailableGames();
  }

  async joinGame(game: Colyseus.RoomAvailable) {
    await this.matchMakingService.joinGame(game.roomId);
    this.router.navigate(["/babylonjs"]);
  }

  gamesPresent(): boolean {
    return this.availableGames.data && this.availableGames.data.length > 0;
  }

  filter(filterValue: any) {
    this.availableGames.filterPredicate = (game: Colyseus.RoomAvailable, filter: string) => this.filterPredicate(game, filter);
    this.availableGames.filter = filterValue.target.value.trim().toLowerCase();
  }

  filterPredicate(game: Colyseus.RoomAvailable, filter: string) {
    return game.metadata.name.trim().toLowerCase().includes(filter) 
    || game.metadata.mode.trim().toLowerCase().includes(filter) 
    || game.metadata.map.trim().toLowerCase().includes(filter);
  }
}
