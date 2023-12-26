import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LobbyService } from './lobby.service';
import { Lobby } from './lobby.model';
import { Member } from './member.model';
import { LobbyMessage } from './lobby-message.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DecodedJwt } from '../auth/decoded-jwt.model';
import { tap } from 'rxjs';
import { UserService } from '../user/user.service';
import { Room } from 'colyseus.js';
import { InboxService } from '../inbox/inbox.service';
import { Activity } from 'src/app/types/activity/activity.type';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap } from 'src/app/types/game-map/game-map.type';

@Injectable({
  providedIn: 'root',
})
export class LobbyManagerService {
  private jwt: string;
  private decodedJwt: DecodedJwt;
  private friendsInboxes: Room<any>[];
  private personalInbox: Room<any>;
  private joinLobbyAudio = new Audio('assets/notifications/sounds/join.mp3');
  private leaveLobbyAudio = new Audio('assets/notifications/sounds/leave.mp3');

  constructor(
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

  // TODO: Check to see if room listeners can be destroyed if lobby is nulled out
  setListeners(lobby: Lobby) {
    let wasKicked = false;
    let wasSelfInitiated = false;

    lobby.room.state.host.onChange = () => {
      this.lobbyService.setHost(lobby.room.state.host);
    };

    lobby.room.state.listen('isReady', (current: boolean) => {
      console.log('setting isReady');
      this.lobbyService.setIsReady(current);
    });

    lobby.room.state.listen('activity', (current: Activity) => {
      console.log('setting activity');
      this.lobbyService.setActivity(current);
      this.userService.setActivity(current);

      this.personalInbox.send('setHostActivity', current);
      this.friendsInboxes.forEach(friendsInbox => {
        friendsInbox.send('notifyHostActivity', {
          id: this.decodedJwt._id,
          activity: current,
        });
      });
    });

    lobby.room.state.listen('queueType', (current: QueueType) => {
      console.log('setting queueType');
      this.lobbyService.setQueueType(current);
      this.userService.setQueueType(current);

      this.personalInbox.send('setHostQueueType', current);
      this.friendsInboxes.forEach(friendsInbox => {
        friendsInbox.send('notifyHostQueueType', {
          id: this.decodedJwt._id,
          queueType: current,
        });
      });
    });

    lobby.room.state.listen('gameType', (current: GameType) => {
      console.log('setting gameType');
      this.lobbyService.setGameType(current);
      this.userService.setGameType(current);

      this.personalInbox.send('setHostGameType', current);
      this.friendsInboxes.forEach(friendsInbox => {
        friendsInbox.send('notifyHostGameType', {
          id: this.decodedJwt._id,
          gameType: current,
        });
      });
    });

    lobby.room.state.listen('gameMode', (current: GameMode) => {
      console.log('setting gameMode');
      this.lobbyService.setGameMode(current);
      this.userService.setGameMode(current);

      this.personalInbox.send('setHostGameMode', current);
      this.friendsInboxes.forEach(friendsInbox => {
        friendsInbox.send('notifyHostGameMode', {
          id: this.decodedJwt._id,
          gameMode: current,
        });
      });
    });

    lobby.room.state.listen('gameMap', (current: GameMap) => {
      console.log('setting gameMap');
      this.lobbyService.setGameMap(current);
      this.userService.setGameMap(current);

      this.personalInbox.send('setHostGameMap', current);
      this.friendsInboxes.forEach(friendsInbox => {
        friendsInbox.send('notifyHostGameMap', {
          id: this.decodedJwt._id,
          gameMap: current,
        });
      });
    });

    lobby.room.state.members.onAdd = (member: Member | any) => {
      member.listen('isHost', (current: boolean) => {
        this.lobbyService.setMemberIsHost(member, current);
      });

      member.listen('isReady', (current: boolean) => {
        this.lobbyService.setMemberIsReady(member, current);
      });

      this.joinLobbyAudio.play();
      this.lobbyService.addMember(member);
    };

    lobby.room.state.members.onRemove = (member: Member) => {
      this.leaveLobbyAudio.play();
      this.lobbyService.removeMember(member);
    };

    lobby.room.state.messages.onAdd = (message: LobbyMessage) => {
      this.lobbyService.addMessage(message);
    };

    lobby.room.onLeave(() => {
      this.lobbyService.setInitialState();
      if (wasKicked || wasSelfInitiated) {
        this.lobbyService
          .createLobby({ jwt: this.jwt })
          .pipe(
            tap(lobby => {
              if (lobby?.room) {
                this.setListeners(lobby);
              }
            })
          )
          .subscribe();
        wasKicked = false;
        wasSelfInitiated = false;
      }
    });

    lobby.room.onMessage('transferHost', (host: Member) => {
      this.joinLobbyAudio.play();
      this.snackBar.open(`${host.username} is now the host!`, 'Dismiss', {
        duration: 5000,
      });
    });

    lobby.room.onMessage('kickMember', (member: Member) => {
      let message = `${member.username} was kicked from the lobby!`;
      if (member._id === this.decodedJwt._id) {
        message = 'You were kicked from the lobby!';
        wasKicked = true;
      }
      this.snackBar.open(message, 'Dismiss', { duration: 5000 });
    });

    lobby.room.onMessage('leaveLobby', () => {
      const message = `You left the lobby!`;
      wasSelfInitiated = true;
      this.snackBar.open(message, 'Dismiss', { duration: 5000 });
    });
  }
}
