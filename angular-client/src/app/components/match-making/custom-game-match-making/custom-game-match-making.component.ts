import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameService } from 'src/app/state/game/game.service';
import { Player } from 'src/app/state/game/player.model';
import { Team } from 'src/app/state/game/team.model';
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

  maxPlayerCount: MaxPlayerCount = 12;

  players: Map<string, Player> = new Map();

  teams: Map<string, Team> = new Map();
  team1Rows: { player: Player | null }[] = [];
  team2Rows: { player: Player | null }[] = [];

  subscription: Subscription = new Subscription();

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameMap$ = this.gameService.gameMap$;
    this.gameMode$ = this.gameService.gameMode$;
    this.subscription.add(
      this.gameService.maxPlayerCount$.subscribe(maxPlayerCount => {
        this.maxPlayerCount = maxPlayerCount;
        this.initializeTeamRows();
      })
    );

    this.subscription.add(
      this.gameService.players$.subscribe(players => {
        this.players = players;
      })
    );

    this.subscription.add(
      this.gameService.teams$.subscribe(teams => {
        this.teams = teams;
        this.initializeTeamRows();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initializeTeamRows(): void {
    const rowsPerTeam = Math.ceil((this.maxPlayerCount ?? 0) / 2);
    this.team1Rows = Array(rowsPerTeam).fill({ player: null });
    this.team2Rows = Array(rowsPerTeam).fill({ player: null });
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
