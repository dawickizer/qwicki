import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LobbyOrchestratorService } from 'src/app/state/lobby/lobby.orchestrator.service';
import { LobbyService } from 'src/app/state/lobby/lobby.service';
import { GameType, gameTypes } from 'src/app/types/game-type/game-type.type';
import {
  QueueType,
  queueTypes,
} from 'src/app/types/queue-type/queue-type.type';

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
    private lobbyOrchestratorService: LobbyOrchestratorService,
    private lobbyService: LobbyService
  ) {}

  ngOnInit(): void {
    this.queueType$ = this.lobbyService.queueType$;
    this.gameType$ = this.lobbyService.gameType$;
  }

  onQueueTypeChange(queueType: QueueType) {
    this.lobbyOrchestratorService.setQueueType(queueType).subscribe();
  }

  onGameTypeChange(gameType: GameType) {
    this.lobbyOrchestratorService.setGameType(gameType).subscribe();
  }

  isHost(): boolean {
    return this.lobbyOrchestratorService.isHost();
  }
}
