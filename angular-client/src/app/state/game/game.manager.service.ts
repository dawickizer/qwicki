import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { GameService } from './game.service';
import { Game } from './game.model';
import { Player } from './player.model';
import { GameMessage } from './game-message.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DecodedJwt } from '../auth/decoded-jwt.model';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { GameMap } from 'src/app/types/game-map/game-map.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { Activity } from 'src/app/types/activity/activity.type';
import { MaxPlayerCount } from 'src/app/types/max-player-count/max-player-count.type';
import { Visibility } from 'src/app/types/visibility/visibility.type';
import { Team } from './team.model';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private jwt: string;
  private decodedJwt: DecodedJwt;
  private joinGameAudio = new Audio('assets/notifications/sounds/join.mp3');
  private leaveGameAudio = new Audio('assets/notifications/sounds/leave.mp3');

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.subscribeToState();
  }

  private subscribeToState() {
    this.authService.jwt$.subscribe(jwt => (this.jwt = jwt));
    this.authService.decodedJwt$.subscribe(
      decodedJwt => (this.decodedJwt = decodedJwt)
    );
  }

  setListeners(game: Game) {
    let wasKicked = false;
    let wasSelfInitiated = false;

    game.room.state.host.onChange = () => {
      this.gameService.setHost(game.room.state.host);
    };

    game.room.state.listen('route', (current: string) => {
      this.gameService.setRoute(current);
      this.router.navigate([current]);
    });

    game.room.state.listen('activity', (current: Activity) => {
      this.gameService.setActivity(current);
    });

    game.room.state.listen('gameType', (current: GameType) => {
      this.gameService.setGameType(current);
    });

    game.room.state.listen('gameMode', (current: GameMode) => {
      this.gameService.setGameMode(current);
    });

    game.room.state.listen('gameMap', (current: GameMap) => {
      this.gameService.setGameMap(current);
    });

    game.room.state.listen('maxPlayerCount', (current: MaxPlayerCount) => {
      this.gameService.setMaxPlayerCount(current);
    });

    game.room.state.listen('visibility', (current: Visibility) => {
      this.gameService.setVisibility(current);
    });

    game.room.state.listen('name', (current: string) => {
      this.gameService.setName(current);
    });

    game.room.state.players.onAdd = (player: Player | any) => {
      player.listen('isHost', (current: boolean) => {
        this.gameService.setPlayerIsHost(player, current);
      });

      this.joinGameAudio.play();
      this.gameService.addPlayer(player);
    };

    game.room.state.players.onRemove = (player: Player) => {
      this.leaveGameAudio.play();
      this.gameService.removePlayer(player);
    };

    game.room.state.teams.onAdd = (team: Team | any) => {
      team.players.onAdd = (player: Player) => {
        this.gameService.joinTeam(team._id, player.sessionId);
      };

      team.players.onRemove = (player: Player) => {
        this.gameService.leaveTeam(team._id, player.sessionId);
      };

      team.listen('maxPlayerCount', (current: MaxPlayerCount) => {
        this.gameService.setMaxPlayerCountByTeamId(team._id, current);
      });

      this.gameService.addTeam(team);
    };

    game.room.state.teams.onRemove = (team: Team) => {
      this.gameService.removeTeam(team);
    };

    game.room.state.messages.onAdd = (message: GameMessage) => {
      this.gameService.addMessage(message);
    };

    game.room.onLeave(() => {
      this.gameService.setInitialState();
      if (wasKicked || wasSelfInitiated) {
        this.gameService
          .createGame({ jwt: this.jwt })
          .pipe(
            tap(game => {
              if (game?.room) {
                this.setListeners(game);
              }
            })
          )
          .subscribe();
        wasKicked = false;
        wasSelfInitiated = false;
      }
    });

    game.room.onMessage('transferHost', (host: Player) => {
      this.joinGameAudio.play();
      this.snackBar.open(`${host.username} is now the host!`, 'Dismiss', {
        duration: 5000,
      });
    });

    game.room.onMessage('kickPlayer', (player: Player) => {
      let message = `${player.username} was kicked from the game!`;
      if (player._id === this.decodedJwt._id) {
        message = 'You were kicked from the game!';
        wasKicked = true;
      }
      this.snackBar.open(message, 'Dismiss', { duration: 5000 });
    });

    game.room.onMessage('leaveGame', () => {
      const message = `You left the game!`;
      wasSelfInitiated = true;
      this.snackBar.open(message, 'Dismiss', { duration: 5000 });
    });
  }
}