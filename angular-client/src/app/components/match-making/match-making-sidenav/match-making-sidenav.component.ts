import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GameType } from 'src/app/models/status/status.model';
import { LobbyService } from 'src/app/state/lobby/lobby.service';

@Component({
  selector: 'app-match-making-sidenav',
  templateUrl: './match-making-sidenav.component.html',
  styleUrls: ['./match-making-sidenav.component.css'],
})
export class MatchMakingSidenavComponent implements OnInit {
  gameType$: Observable<GameType>;

  constructor(private lobbyService: LobbyService) {}

  ngOnInit() {
    this.gameType$ = this.lobbyService.gameType$;
  }
}
