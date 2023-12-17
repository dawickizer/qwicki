import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LobbyService } from './lobby.service';
import { Lobby } from './lobby.model';
import { Member } from './member.model';
import { LobbyMessage } from './lobby-message.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DecodedJwt } from '../auth/decoded-jwt.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LobbyManagerService {
  private jwt: string;
  private decodedJwt: DecodedJwt;
  private joinLobbyAudio = new Audio('assets/notifications/sounds/join.mp3');
  private leaveLobbyAudio = new Audio('assets/notifications/sounds/leave.mp3');

  constructor(
    private lobbyService: LobbyService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.subscribeToState();
  }

  private subscribeToState() {
    this.authService.jwt$.subscribe(jwt => (this.jwt = jwt));
    this.authService.decodedJwt$.subscribe(
      decodedJwt => (this.decodedJwt = decodedJwt)
    );
  }

  setListeners(lobby: Lobby) {
    let wasKicked = false;
    let wasSelfInitiated = false;

    lobby.room.state.host.onChange = () => {
      this.lobbyService.setHost(lobby.room.state.host);
    };

    lobby.room.state.status.onChange = () => {
      this.lobbyService.updateStatus(lobby.room.state.status);
    };

    lobby.room.state.members.onAdd = (member: Member | any) => {
      member.listen('isHost', (current: boolean) => {
        this.lobbyService.setMemberIsHost(member, current);
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