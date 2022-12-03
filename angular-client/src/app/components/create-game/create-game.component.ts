import { Component, OnInit, Input } from '@angular/core';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';
import { Router } from '@angular/router';
import { Game } from 'src/app/models/game/game';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

  public game: Game = new Game();

  constructor(private router: Router, public matchMakingService: MatchMakingService) {}

  ngOnInit() {}

  async createGame() {
    await this.matchMakingService.createGame(this.game);
    this.router.navigate(["/babylonjs"]);
  }
}
