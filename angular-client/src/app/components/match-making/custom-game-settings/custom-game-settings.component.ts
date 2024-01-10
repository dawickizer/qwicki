import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Visibility,
  visibilities,
} from 'src/app/types/visibility/visibility.type';
import { GameMode, gameModes } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap, gameMaps } from 'src/app/types/game-map/game-map.type';
import {
  MaxPlayerCount,
  maxPlayerCounts,
} from 'src/app/types/max-player-count/max-player-count.type';
import { GameOrchestratorService } from 'src/app/state/game/game.orchestrator.service';
import { GameService } from 'src/app/state/game/game.service';
import { Subscription } from 'rxjs';
import { Player } from 'src/app/state/game/player.model';

@Component({
  selector: 'app-custom-game-settings',
  templateUrl: './custom-game-settings.component.html',
  styleUrls: ['./custom-game-settings.component.css'],
})
export class CustomGameSettingsComponent implements OnInit, OnDestroy {
  name: string;
  gameMode: GameMode;
  gameMap: GameMap;
  visibility: Visibility;
  maxPlayerCount: MaxPlayerCount;
  players: Map<string, Player>;

  gameModes: GameMode[] = gameModes;
  gameMaps: GameMap[] = gameMaps;
  visibilities: Visibility[] = visibilities;
  maxPlayerCounts: MaxPlayerCount[] = maxPlayerCounts;

  private subscription = new Subscription();

  constructor(
    private gameOrchestratorService: GameOrchestratorService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.gameService.name$.subscribe(value => (this.name = value))
    );
    this.subscription.add(
      this.gameService.gameMode$.subscribe(value => (this.gameMode = value))
    );
    this.subscription.add(
      this.gameService.gameMap$.subscribe(value => (this.gameMap = value))
    );
    this.subscription.add(
      this.gameService.visibility$.subscribe(value => (this.visibility = value))
    );
    this.subscription.add(
      this.gameService.maxPlayerCount$.subscribe(
        value => (this.maxPlayerCount = value)
      )
    );
    this.subscription.add(
      this.gameService.players$.subscribe(value => (this.players = value))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      .subscribe({
        // TODO: Super jank to set a timeout for this but nothing else working and dont wanna waste time. Basically this waits 50s ms and updates the value back to what it originally was
        error: (maxPlayerCount: MaxPlayerCount) =>
          setTimeout(() => (this.maxPlayerCount = maxPlayerCount), 50),
      });
  }

  async onVisibilityChange(newVisibility: Visibility) {
    this.gameOrchestratorService.setVisibility(newVisibility).subscribe();
  }
}
