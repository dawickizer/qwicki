import { Component, OnInit } from '@angular/core';
import {
  Visibility,
  visibilities,
} from 'src/app/types/visibility/visibility.type';
import {
  GameMode,
  gameModesNoAny,
} from 'src/app/types/game-mode/game-mode.type.';
import { GameMap, gameMapsNoAny } from 'src/app/types/game-map/game-map.type';
import {
  MaxPlayerCount,
  maxPlayerCounts,
} from 'src/app/types/max-player-count/max-player-count.type';
import { GameOrchestratorService } from 'src/app/state/game/game.orchestrator.service';
import { GameService } from 'src/app/state/game/game.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-custom-game-settings',
  templateUrl: './custom-game-settings.component.html',
  styleUrls: ['./custom-game-settings.component.css'],
})
export class CustomGameSettingsComponent implements OnInit {
  name$: Observable<string>;

  gameMode$: Observable<GameMode>;
  gameModes: GameMode[] = gameModesNoAny;

  gameMap$: Observable<GameMap>;
  gameMaps: GameMap[] = gameMapsNoAny;

  visibility$: Observable<Visibility>;
  visibilities: Visibility[] = visibilities;

  maxPlayerCount$: Observable<MaxPlayerCount>;
  maxPlayerCounts: MaxPlayerCount[] = maxPlayerCounts;

  constructor(
    private gameOrchestratorService: GameOrchestratorService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.name$ = this.gameService.name$;
    this.gameMode$ = this.gameService.gameMode$;
    this.gameMap$ = this.gameService.gameMap$;
    this.visibility$ = this.gameService.visibility$;
    this.maxPlayerCount$ = this.gameService.maxPlayerCount$;
  }

  onGameNameBlur(newGameName: string) {
    this.gameOrchestratorService.setName(newGameName).subscribe();
  }

  onGameModeChange(newGameMode: GameMode) {
    this.gameOrchestratorService.setGameMode(newGameMode).subscribe();
  }

  onGameMapChange(newGameMap: GameMap) {
    this.gameOrchestratorService.setGameMap(newGameMap).subscribe();
  }

  onMaxPlayerCountChange(newMaxPlayerCount: MaxPlayerCount) {
    this.gameOrchestratorService
      .setMaxPlayerCount(newMaxPlayerCount)
      .subscribe();
  }

  onVisibilityChange(newVisibility: Visibility) {
    this.gameOrchestratorService.setVisibility(newVisibility).subscribe();
  }
}
