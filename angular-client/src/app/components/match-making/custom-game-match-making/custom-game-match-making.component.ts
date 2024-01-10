import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameService } from 'src/app/state/game/game.service';
import { Player } from 'src/app/state/game/player.model';
import { GameMap, getMapImage } from 'src/app/types/game-map/game-map.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { MaxPlayerCount } from 'src/app/types/max-player-count/max-player-count.type';

@Component({
  selector: 'app-custom-game-match-making',
  templateUrl: './custom-game-match-making.component.html',
  styleUrls: ['./custom-game-match-making.component.css'],
})
export class CustomGameMatchMakingComponent implements OnInit, OnDestroy {
  activeTabIndex = 0;

  gameMap$: Observable<GameMap>;
  gameMode$: Observable<GameMode>;

  maxPlayerCountSubscription: Subscription;
  maxPlayerCount: MaxPlayerCount = 12;
  players: Player[] = [];

  team1Rows: { player: Player | null }[] = [];
  team2Rows: { player: Player | null }[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameMap$ = this.gameService.gameMap$;
    this.gameMode$ = this.gameService.gameMode$;
    this.maxPlayerCountSubscription =
      this.gameService.maxPlayerCount$.subscribe(maxPlayerCount => {
        this.maxPlayerCount = maxPlayerCount;
        this.initializeTeamRows();
        //this.populateTeamsWithPlayers();
      });

    this.players = [
      { username: 'AceGamer' },
      { username: 'MysticShadow' },
      { username: 'PixelPirate' },
      { username: 'CyberWizard' },
      { username: 'RogueRaider' },
      { username: 'TacticalTrooper' },
      { username: 'StealthStriker' },
      { username: 'VirtualValkyrie' },
      { username: 'NeonNinja' },
      { username: 'GalacticGuardian' },
    ];
  }

  ngOnDestroy() {
    this.maxPlayerCountSubscription.unsubscribe();
  }

  initializeTeamRows(): void {
    const rowsPerTeam = Math.ceil((this.maxPlayerCount ?? 0) / 2);
    this.team1Rows = Array(rowsPerTeam).fill({ player: null });
    this.team2Rows = Array(rowsPerTeam).fill({ player: null });
  }

  populateTeamsWithPlayers(): void {
    this.players.forEach((player, index) => {
      if (index < this.team1Rows.length) {
        this.team1Rows[index] = { player };
      } else {
        this.team2Rows[index - this.team1Rows.length] = { player };
      }
    });
  }

  onTabChanged(index: number): void {
    this.activeTabIndex = index;
  }

  start(): void {
    console.log('Starting game...');
    // Implement game start logic here
  }

  getMapImage(mapName: string) {
    return getMapImage(mapName);
  }
}
