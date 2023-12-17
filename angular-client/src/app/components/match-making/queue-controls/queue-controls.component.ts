import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GameType,
  QueueType,
  gameTypes,
  queueTypes,
} from 'src/app/models/status/status.model';
import { LobbyOrchestratorService } from 'src/app/state/lobby/lobby.orchestrator.service';
import { LobbyService } from 'src/app/state/lobby/lobby.service';
import { UserOrchestratorService } from 'src/app/state/user/user.orchestrator.service';
import { UserService } from 'src/app/state/user/user.service';

@Component({
  selector: 'app-queue-controls',
  templateUrl: './queue-controls.component.html',
  styleUrls: ['./queue-controls.component.css'],
})
export class QueueControlsComponent implements OnInit {
  queueTypes: QueueType[] = queueTypes;
  gameTypes: GameType[] = gameTypes;
  queueType$: Observable<QueueType>;
  gameType$: Observable<GameType>;

  constructor(
    private userOrchestratorService: UserOrchestratorService,
    private lobbyOrchestratorService: LobbyOrchestratorService,
    private userService: UserService,
    private lobbyService: LobbyService
  ) {}

  ngOnInit(): void {
    this.queueType$ = this.userService.queueType$;
    this.gameType$ = this.userService.gameType$;

    this.lobbyService.status$.subscribe(s => console.log(s));
    this.lobbyService.queueType$.subscribe(qt => console.log(qt));
    this.lobbyService.gameType$.subscribe(gt => console.log(gt));
  }

  onQueueTypeChange(queueType: QueueType) {
    this.userOrchestratorService.updateStatus({ queueType }).subscribe();
    this.lobbyOrchestratorService.updateStatus({ queueType }).subscribe();
  }

  onGameTypeChange(gameType: GameType) {
    this.userOrchestratorService.updateStatus({ gameType }).subscribe();
    this.lobbyOrchestratorService.updateStatus({ gameType }).subscribe();
  }
}
