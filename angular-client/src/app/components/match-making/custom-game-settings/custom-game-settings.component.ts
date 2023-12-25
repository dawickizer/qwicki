import { Component, OnInit } from '@angular/core';
import {
  Visibility,
  visibilities,
} from 'src/app/types/visibility/visibility.type';
import { LobbyOrchestratorService } from 'src/app/state/lobby/lobby.orchestrator.service';
import { GameMode, gameModes } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap, gameMaps } from 'src/app/types/game-map/game-map.type';

@Component({
  selector: 'app-custom-game-settings',
  templateUrl: './custom-game-settings.component.html',
  styleUrls: ['./custom-game-settings.component.css'],
})
export class CustomGameSettingsComponent implements OnInit {
  selectedGameMode: GameMode = 'Any';
  gameModes: GameMode[] = gameModes;

  selectedGameMap: GameMap = 'Any';
  gameMaps: GameMap[] = gameMaps;

  selectedVisibility: Visibility = 'Private (Invite Only)';
  visibilities: Visibility[] = visibilities;

  selectedPlayerCount = 12;
  playerCounts: number[] = [1, 2, 4, 6, 8, 10, 12];
  constructor(private lobbyOrchestratorService: LobbyOrchestratorService) {}

  ngOnInit(): void {}
}
