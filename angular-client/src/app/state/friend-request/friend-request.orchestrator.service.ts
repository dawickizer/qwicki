import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { User } from '../user/user.model';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { FriendRequestService } from '../friend-request/friend-request.service';
import { FriendRequest } from '../friend-request/friend-requests.model';

@Injectable({
  providedIn: 'root',
})
export class FriendRequestOrchestratorService {
  private user: User;
  private jwt: string;

  constructor(
    private friendRequestService: FriendRequestService,
    private userService: UserService,
    private authService: AuthService,
    private colyseusService: ColyseusService
  ) {
    this.subscribeToState();
  }

  private subscribeToState() {
    this.authService.jwt$.subscribe(jwt => (this.jwt = jwt));
    this.userService.user$.subscribe(user => (this.user = user));
  }

  setInitialState() {
    this.friendRequestService.setInitialState();
  }

  sendFriendRequest(potentialFriend: string): Observable<FriendRequest> {
    return this.friendRequestService
      .sendFriendRequest(this.user, potentialFriend)
      .pipe(
        tap(async friendRequest => {
          if (friendRequest) {
            const inbox = await this.colyseusService.joinExistingRoomIfPresent(
              friendRequest.to._id,
              { jwt: this.jwt }
            );
            if (inbox) {
              inbox.send('sendFriendRequest', friendRequest);
              this.colyseusService.leaveRoom(inbox);
            }
          }
        })
      );
  }

  revokeFriendRequest(friendRequest: FriendRequest): Observable<FriendRequest> {
    return this.friendRequestService
      .revokeFriendRequest(this.user, friendRequest)
      .pipe(
        tap(async friendRequest => {
          const inbox = await this.colyseusService.joinExistingRoomIfPresent(
            friendRequest.to._id,
            { jwt: this.jwt }
          );
          if (inbox) {
            inbox.send('revokeFriendRequest', friendRequest);
            this.colyseusService.leaveRoom(inbox);
          }
        })
      );
  }

  rejectFriendRequest(friendRequest: FriendRequest): Observable<FriendRequest> {
    return this.friendRequestService
      .rejectFriendRequest(this.user, friendRequest)
      .pipe(
        tap(async friendRequest => {
          const inbox = await this.colyseusService.joinExistingRoomIfPresent(
            friendRequest.from._id,
            { jwt: this.jwt }
          );
          if (inbox) {
            inbox.send('rejectFriendRequest', friendRequest);
            this.colyseusService.leaveRoom(inbox);
          }
        })
      );
  }
}
