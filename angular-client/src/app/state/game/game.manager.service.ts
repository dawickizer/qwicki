import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { GameService } from './game.service';
import { Game } from './game.model';
import { Player } from './player.model';
import { GameMessage } from './game-message.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DecodedJwt } from '../auth/decoded-jwt.model';
import { tap } from 'rxjs';
import { UserService } from '../user/user.service';
import { Status } from 'src/app/models/status/status.model';
import { Room } from 'colyseus.js';
import { InboxService } from '../inbox/inbox.service';
import { LobbyService } from '../lobby/lobby.service';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private jwt: string;
  private decodedJwt: DecodedJwt;
  private friendsInboxes: Room<any>[];
  private personalInbox: Room<any>;
  private joinGameAudio = new Audio('assets/notifications/sounds/join.mp3');
  private leaveGameAudio = new Audio('assets/notifications/sounds/leave.mp3');

  constructor(
    private gameService: GameService,
    private lobbyService: LobbyService,
    private userService: UserService,
    private authService: AuthService,
    private inboxService: InboxService,
    private snackBar: MatSnackBar
  ) {
    this.subscribeToState();
  }

  private subscribeToState() {
    this.authService.jwt$.subscribe(jwt => (this.jwt = jwt));
    this.authService.decodedJwt$.subscribe(
      decodedJwt => (this.decodedJwt = decodedJwt)
    );
    this.inboxService.friendsInboxes$.subscribe(
      friendsInboxes => (this.friendsInboxes = friendsInboxes)
    );
    this.inboxService.personalInbox$.subscribe(
      personalInbox => (this.personalInbox = personalInbox)
    );
  }

  setListeners(game: Game) {
    let wasKicked = false;
    let wasSelfInitiated = false;

    game.room.state.host.onChange = () => {
      this.gameService.setHost(game.room.state.host);
    };

    game.room.state.activity.onChange = () => {
      const updatedStatus = new Status({ activity: game.room.state.activity });
      this.gameService.setActivity(game.room.state.activity);
      this.lobbyService.updateStatus(updatedStatus);
      this.userService.updateStatus(updatedStatus);

      // notify friends of status change
      this.personalInbox.send('updateHostStatus', updatedStatus);
      this.friendsInboxes.forEach(friendsInbox => {
        friendsInbox.send('notifyHostStatus', {
          id: this.decodedJwt._id,
          status: updatedStatus,
        });
      });
    };

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
