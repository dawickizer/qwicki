import { Component, OnInit } from '@angular/core';
import {
  GameMap,
  GameMode,
  gameMaps,
  gameModes,
} from 'src/app/models/status/status.model';
import { Visibility, visibilities } from 'src/app/models/visibility/visibility';
import { LobbyOrchestratorService } from 'src/app/state/lobby/lobby.orchestrator.service';

@Component({
  selector: 'app-custom-game-match-making',
  templateUrl: './custom-game-match-making.component.html',
  styleUrls: ['./custom-game-match-making.component.css'],
})
export class CustomGameMatchMakingComponent implements OnInit {
  activeTabIndex = 0;

  selectedGameMode: GameMode = 'Any';
  gameModes: GameMode[] = gameModes;

  selectedGameMap: GameMap = 'Any';
  gameMaps: GameMap[] = gameMaps;

  selectedVisibility: Visibility = 'Private (Invite Only)';
  visibilities: Visibility[] = visibilities;

  constructor(private lobbyOrchestratorService: LobbyOrchestratorService) {}

  ngOnInit(): void {}

  onTabChanged(index: number): void {
    this.activeTabIndex = index;
  }

  start(): void {
    console.log('Starting game...');
    // Implement game start logic here
  }
}