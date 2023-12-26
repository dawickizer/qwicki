import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LobbyService } from 'src/app/state/lobby/lobby.service';
import { GameType } from 'src/app/types/game-type/game-type.type';

@Component({
  selector: 'app-match-making-sidenav',
  templateUrl: './match-making-sidenav.component.html',
  styleUrls: ['./match-making-sidenav.component.css'],
})
export class MatchMakingSidenavComponent implements OnInit {
  gameType$: Observable<GameType>;
  route$: Observable<string>;

  constructor(private lobbyService: LobbyService) {}

  ngOnInit() {
    this.gameType$ = this.lobbyService.gameType$;
    this.route$ = this.lobbyService.route$;
  }
}
