import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GameType, QueueType } from 'src/app/models/status/status.model';
import { User } from 'src/app/state/user/user.model';
import { UserOrchestratorService } from 'src/app/state/user/user.orchestrator.service';
import { UserService } from 'src/app/state/user/user.service';

@Component({
  selector: 'app-queue-controls',
  templateUrl: './queue-controls.component.html',
  styleUrls: ['./queue-controls.component.css'],
})
export class QueueControlsComponent implements OnInit {
  queueTypes: QueueType[] = ['Solo', 'Duo', 'Squad'];
  gameTypes: GameType[] = ['Normal', 'Ranked', 'Money Match', 'Custom'];

  user$: Observable<User>;

  constructor(
    private userOrchestratorService: UserOrchestratorService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user$ = this.userService.user$;
  }

  onQueueTypeChange(queueType: QueueType) {
    this.userOrchestratorService.updateStatus({ queueType }).subscribe();
  }

  onGameTypeChange(gameType: GameType) {
    this.userOrchestratorService.updateStatus({ gameType }).subscribe();
  }
}
