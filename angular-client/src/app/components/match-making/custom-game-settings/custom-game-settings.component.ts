import { Component, OnInit } from '@angular/core';
import {
  Visibility,
  visibilities,
} from 'src/app/types/visibility/visibility.type';
import { LobbyOrchestratorService } from 'src/app/state/lobby/lobby.orchestrator.service';
import { GameMode, gameModes } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap, gameMaps } from 'src/app/types/game-map/game-map.type';
import {
  MaxPlayerCount,
  maxPlayerCounts,
} from 'src/app/types/max-player-count/max-player-count.type';

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

  selectedMaxPlayerCount = 12;
  maxPlayerCounts: MaxPlayerCount[] = maxPlayerCounts;
  constructor(private lobbyOrchestratorService: LobbyOrchestratorService) {}

  ngOnInit(): void {}

  onGameNameBlur(gameName: string) {
    // Logic when game name input loses focus
    console.log('Game Name:', gameName);
    // Implement your logic here, e.g., update a state, call a service, etc.
  }

  onGameModeChange(newGameMode: GameMode) {
    // Logic when game mode changes
    console.log('New Game Mode:', newGameMode);
    // Call a method from the service or any other logic
  }

  onGameMapChange(newGameMap: GameMap) {
    // Logic when game map changes
    console.log('New Game Map:', newGameMap);
    // Implement your logic here
  }

  onMaxPlayerCountChange(newMaxPlayerCount: MaxPlayerCount) {
    // Logic when max player count changes
    console.log('New Max Player Count:', newMaxPlayerCount);
    // Implement your logic here
  }

  onVisibilityChange(newVisibility: Visibility) {
    // Logic when visibility changes
    console.log('New Visibility:', newVisibility);
    // Implement your logic here
  }
}
