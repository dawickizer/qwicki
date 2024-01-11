import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  gameMap: GameMap;
  gameMode: GameMode;

  maxPlayerCount: MaxPlayerCount = 12;

  players: Map<string, Player> = new Map();

  teams: Map<string, Team> = new Map();
  dynamicTeams: { team: Team; rows: { player: Player | null }[] }[] = [];

  subscription: Subscription = new Subscription();

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.gameService.gameMap$.subscribe(gameMap => {
        this.gameMap = gameMap;
      })
    );

    this.subscription.add(
      this.gameService.gameMode$.subscribe(gameMode => {
        this.gameMode = gameMode;
      })
    );

    this.subscription.add(
      this.gameService.maxPlayerCount$.subscribe(maxPlayerCount => {
        this.maxPlayerCount = maxPlayerCount;
        this.initializeDynamicTeams();
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
        this.initializeDynamicTeams();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initializeDynamicTeams(): void {
    this.dynamicTeams = Array.from(this.teams?.values() ?? []).map(team => {
      // Calculate the number of rows per team
      const rowsPerTeam = Math.ceil(this.maxPlayerCount / this.teams.size);

      // Create an array of players in the team, padded with nulls if necessary
      const playersArray = [
        ...team.players.values(),
        ...Array(rowsPerTeam).fill(null),
      ];

      // Slice the array to ensure it's not longer than the required number of rows
      const teamRows = playersArray
        .slice(0, rowsPerTeam)
        .map(player => ({ player }));

      return {
        team: team,
        rows: teamRows,
      };
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

  joinTeam(teamId: string) {
    console.log('Join team:', teamId);
    // Add your logic here to handle joining the team
  }
}
