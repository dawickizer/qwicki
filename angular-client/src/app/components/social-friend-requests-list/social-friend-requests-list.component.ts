import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user/user';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { SocialService } from 'src/app/services/social/social.service';
import * as Colyseus from 'colyseus.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-social-friend-requests-list',
  templateUrl: './social-friend-requests-list.component.html',
  styleUrls: ['./social-friend-requests-list.component.css'],
})
export class SocialFriendRequestsListComponent {
  @Input() title: string;
  @Input() titleColor: string;

  @Output() send: EventEmitter<FriendRequest> = new EventEmitter();
  @Output() accept: EventEmitter<boolean> = new EventEmitter();

  @Input() friendRequests: MatTableDataSource<FriendRequest>;
  @Output() friendRequestsChange: EventEmitter<
    MatTableDataSource<FriendRequest>
  > = new EventEmitter();
  friendRequestsDisplayedColumns: string[] = ['username', 'action'];

  private _update: FriendRequest;
  @Input() set update(update: FriendRequest) {
    this._update = update;
    if (update) this.updateFriendRequests();
  }

  get update(): FriendRequest {
    return this._update;
  }

  potentialFriend: string;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public colyseusService: ColyseusService,
    private socialService: SocialService
  ) {}

  isInboundFriendRequestsComponent(): boolean {
    return this.title === 'friend requests';
  }

  sendFriendRequest() {
    this.socialService.sendFriendRequest(this.potentialFriend).subscribe({
      next: async host => {
        this.colyseusService.host = new User(host);
        const friendRequest: FriendRequest = this.findOutboundFriendRequest();
        const room: Colyseus.Room =
          await this.colyseusService.joinExistingRoomIfPresent(
            friendRequest.to
          );
        if (room) {
          room.send('sendFriendRequest', friendRequest);
          this.colyseusService.leaveRoom(room);
        }
        this.send.emit(friendRequest);
        this.openSnackBar(
          'Friend request sent to ' + this.potentialFriend,
          'Dismiss'
        );
        this.potentialFriend = '';
      },
      error: error => {
        this.openSnackBar(error, 'Dismiss');
        this.potentialFriend = '';
      },
    });
  }

  acceptFriendRequest(friendRequest: FriendRequest) {
    this.socialService.acceptFriendRequest(friendRequest).subscribe({
      next: async host => {
        this.colyseusService.host = new User(host);
        const room: Colyseus.Room =
          await this.colyseusService.joinExistingRoomIfPresent(
            friendRequest.from
          );
        if (room) {
          room.send('acceptFriendRequest', friendRequest);
          this.colyseusService.onlineFriendsRooms.push(room);
        }
        this.updateFriendRequests();
        this.accept.emit(true);
        this.openSnackBar(
          `You and ${friendRequest.from.username} are now friends`,
          'Dismiss'
        );
      },
      error: error => this.openSnackBar(error, 'Dismiss'),
    });
  }

  rejectFriendRequest(friendRequest: FriendRequest) {
    this.socialService.rejectFriendRequest(friendRequest).subscribe({
      next: async host => {
        this.colyseusService.host = new User(host);
        const room: Colyseus.Room =
          await this.colyseusService.joinExistingRoomIfPresent(
            friendRequest.from
          );
        if (room) {
          room.send('rejectFriendRequest', friendRequest);
          this.colyseusService.leaveRoom(room);
        }
        this.updateFriendRequests();
        this.openSnackBar(
          `Rejected ${friendRequest.from.username}'s friend request`,
          'Dismiss'
        );
      },
      error: error => this.openSnackBar(error, 'Dismiss'),
    });
  }

  revokeFriendRequest(friendRequest: FriendRequest) {
    this.socialService.revokeFriendRequest(friendRequest).subscribe({
      next: async host => {
        this.colyseusService.host = new User(host);
        const room: Colyseus.Room =
          await this.colyseusService.joinExistingRoomIfPresent(
            friendRequest.to
          );
        if (room) {
          room.send('revokeFriendRequest', friendRequest);
          this.colyseusService.leaveRoom(room);
        }
        this.updateFriendRequests();
        this.openSnackBar(
          `Revoked ${friendRequest.to.username}'s friend request`,
          'Dismiss'
        );
      },
      error: error => this.openSnackBar(error, 'Dismiss'),
    });
  }

  private updateFriendRequests() {
    this.friendRequests.data = this.isInboundFriendRequestsComponent()
      ? this.colyseusService.host.inboundFriendRequests
      : this.colyseusService.host.outboundFriendRequests;
    this.friendRequests._updateChangeSubscription();
  }

  private findOutboundFriendRequest(): FriendRequest {
    return this.colyseusService.host.outboundFriendRequests.find(
      friendRequest =>
        friendRequest.to.username.toLowerCase() ===
        this.potentialFriend.toLowerCase()
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
