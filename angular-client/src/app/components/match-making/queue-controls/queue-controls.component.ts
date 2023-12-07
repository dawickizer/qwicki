import { Component } from '@angular/core';
import { GameType, QueueType } from 'src/app/models/status/status.model';
import { UserOrchestratorService } from 'src/app/state/user/user.orchestrator.service';

@Component({
  selector: 'app-queue-controls',
  templateUrl: './queue-controls.component.html',
  styleUrls: ['./queue-controls.component.css'],
})
export class QueueControlsComponent {
  queueTypes: QueueType[] = ['Solo', 'Duo', 'Squad'];
  gameTypes: GameType[] = ['Normal', 'Ranked', 'Money Match', 'Custom'];

  constructor(private userOrchestatorService: UserOrchestratorService) {}

  onQueueTypeChange(queueType: QueueType) {
    this.userOrchestatorService.updateStatus({ queueType }).subscribe();
  }

  onGameTypeChange(gameType: GameType) {
    this.userOrchestatorService.updateStatus({ gameType }).subscribe();
  }
}
