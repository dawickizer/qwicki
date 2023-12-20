import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import {
  GameType,
  QueueType,
  gameTypes,
  queueTypes,
} from 'src/app/models/status/status.model';
import { AuthService } from 'src/app/state/auth/auth.service';
import { DecodedJwt } from 'src/app/state/auth/decoded-jwt.model';
import { LobbyOrchestratorService } from 'src/app/state/lobby/lobby.orchestrator.service';
import { LobbyService } from 'src/app/state/lobby/lobby.service';
import { Member } from 'src/app/state/lobby/member.model';

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
  decodedJwt$: Observable<DecodedJwt>;
  host$: Observable<Member>;
  isDisabled$: Observable<boolean>;

  constructor(
    private lobbyOrchestratorService: LobbyOrchestratorService,
    private lobbyService: LobbyService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.queueType$ = this.lobbyService.queueType$;
    this.gameType$ = this.lobbyService.gameType$;
    this.decodedJwt$ = this.authService.decodedJwt$;
    this.host$ = this.lobbyService.host$;
    this.isDisabled$ = combineLatest([this.host$, this.decodedJwt$]).pipe(
      map(([host, decodedJwt]) => host?._id !== decodedJwt?._id)
    );
  }

  onQueueTypeChange(queueType: QueueType) {
    this.lobbyOrchestratorService.updateStatus({ queueType }).subscribe();
  }

  onGameTypeChange(gameType: GameType) {
    this.lobbyOrchestratorService.updateStatus({ gameType }).subscribe();
  }
}
