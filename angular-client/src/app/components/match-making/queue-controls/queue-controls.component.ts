import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GameType,
  QueueType,
  gameTypes,
  queueTypes,
} from 'src/app/models/status/status.model';
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
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.queueType$ = this.userService.queueType$;
    this.gameType$ = this.userService.gameType$;
  }

  onQueueTypeChange(queueType: QueueType) {
    this.userOrchestratorService.updateStatus({ queueType }).subscribe();
  }

  onGameTypeChange(gameType: GameType) {
    this.userOrchestratorService.updateStatus({ gameType }).subscribe();
  }
}
