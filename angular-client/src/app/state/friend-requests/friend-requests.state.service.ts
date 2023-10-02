import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, of, catchError } from 'rxjs';
import { FriendRequestsState, initialState } from './friend-requests.state';
import {
  isLoadingSelector,
  inboundFriendRequestsSelector,
  outboundFriendRequestsSelector,
} from './friend-requests.state.selectors';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';
import { User } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FriendsStateService } from '../friends/friends.state.service';
import { UserStateService } from '../user/user.state.service';

@Injectable({
  providedIn: 'root',
})
export class FriendRequestsStateService {
  private user: User;

  private _friendRequestsState = new BehaviorSubject<FriendRequestsState>(
    initialState
  );

  public friendRequestsState$: Observable<FriendRequestsState> =
    this._friendRequestsState.asObservable();
  public isLoading$ = isLoadingSelector(this.friendRequestsState$);
  public inboundFriendRequests$ = inboundFriendRequestsSelector(
    this.friendRequestsState$
  );
  public outboundFriendRequests$ = outboundFriendRequestsSelector(
    this.friendRequestsState$
  );

  constructor(
    private userService: UserService,
    private friendsStateService: FriendsStateService,
    private userStateService: UserStateService,
    private snackBar: MatSnackBar
  ) {
    this.subscribeToUserState();
  }

  private subscribeToUserState() {
    this.userStateService.user$.subscribe(user => {
      this.user = user;
    });
  }

  // Side effects
  sendFriendRequest(potentialFriend: string) {
    this.setIsLoading(true);
    this.userService
      .createFriendRequest(this.user, potentialFriend)
      .pipe(
        tap(user => {
          this.setOutboundFriendRequests(user.outboundFriendRequests);
          this.setIsLoading(false);
          this.snackBar.open(
            `Friend Request sent to ${potentialFriend}`,
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(this.handleError)
      )
      .subscribe();

    // this.socialService.sendFriendRequest(this.potentialFriend).subscribe({
    //   next: async host => {
    //     this.colyseusService.host = new User(host);
    //     const friendRequest: FriendRequest = this.findOutboundFriendRequest();
    //     const room: Colyseus.Room =
    //       await this.colyseusService.joinExistingRoomIfPresent(
    //         friendRequest.to
    //       );
    //     if (room) {
    //       room.send('sendFriendRequest', friendRequest);
    //       this.colyseusService.leaveRoom(room);
    //     }
    //     this.send.emit(friendRequest);
    //     this.openSnackBar(
    //       'Friend request sent to ' + this.potentialFriend,
    //       'Dismiss'
    //     );
    //     this.potentialFriend = '';
    //   },
    //   error: error => {
    //     this.openSnackBar(error, 'Dismiss');
    //     this.potentialFriend = '';
    //   },
    // });
  }

  acceptFriendRequest(friendRequest: FriendRequest): void {
    this.setIsLoading(true);
    this.userService
      .addFriend(this.user, friendRequest._id)
      .pipe(
        tap(user => {
          this.setInboundFriendRequests(user.inboundFriendRequests);
          this.friendsStateService.setFriends(user.friends);
          this.setIsLoading(false);
          this.snackBar.open(
            `You and ${friendRequest.from.username} are now friends`,
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(this.handleError)
      )
      .subscribe();
    // this.socialService.acceptFriendRequest(friendRequest).subscribe({
    //   next: async host => {
    //     this.colyseusService.host = new User(host);
    //     const room: Colyseus.Room =
    //       await this.colyseusService.joinExistingRoomIfPresent(
    //         friendRequest.from
    //       );
    //     if (room) {
    //       room.send('acceptFriendRequest', friendRequest);
    //       this.colyseusService.onlineFriendsRooms.push(room);
    //     }
    //     this.updateFriendRequests();
    //     this.accept.emit(true);
    //     this.openSnackBar(
    //       `You and ${friendRequest.from.username} are now friends`,
    //       'Dismiss'
    //     );
    //   },
    //   error: error => this.openSnackBar(error, 'Dismiss'),
    // });
  }

  revokeFriendRequest(friendRequest: FriendRequest): void {
    this.setIsLoading(true);
    this.userService
      .deleteFriendRequest(this.user, friendRequest._id)
      .pipe(
        tap(user => {
          this.setOutboundFriendRequests(user.outboundFriendRequests);
          this.setIsLoading(false);
          this.snackBar.open(
            `Friend Request unsent to ${friendRequest.to.username}`,
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(this.handleError)
      )
      .subscribe();
    // this.socialService.revokeFriendRequest(friendRequest).subscribe({
    //   next: async host => {
    //     this.colyseusService.host = new User(host);
    //     const room: Colyseus.Room =
    //       await this.colyseusService.joinExistingRoomIfPresent(
    //         friendRequest.to
    //       );
    //     if (room) {
    //       room.send('revokeFriendRequest', friendRequest);
    //       this.colyseusService.leaveRoom(room);
    //     }
    //     this.updateFriendRequests();
    //     this.openSnackBar(
    //       `Revoked ${friendRequest.to.username}'s friend request`,
    //       'Dismiss'
    //     );
    //   },
    //   error: error => this.openSnackBar(error, 'Dismiss'),
    // });
  }

  rejectFriendRequest(friendRequest: FriendRequest): void {
    this.setIsLoading(true);
    this.userService
      .deleteFriendRequest(this.user, friendRequest._id)
      .pipe(
        tap(user => {
          this.setInboundFriendRequests(user.inboundFriendRequests);
          this.setIsLoading(false);
          this.snackBar.open(
            `Friend Request from ${friendRequest.from.username} rejected`,
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(this.handleError)
      )
      .subscribe();
    // this.socialService.rejectFriendRequest(friendRequest).subscribe({
    //   next: async host => {
    //     this.colyseusService.host = new User(host);
    //     const room: Colyseus.Room =
    //       await this.colyseusService.joinExistingRoomIfPresent(
    //         friendRequest.from
    //       );
    //     if (room) {
    //       room.send('rejectFriendRequest', friendRequest);
    //       this.colyseusService.leaveRoom(room);
    //     }
    //     this.updateFriendRequests();
    //     this.openSnackBar(
    //       `Rejected ${friendRequest.from.username}'s friend request`,
    //       'Dismiss'
    //     );
    //   },
    //   error: error => this.openSnackBar(error, 'Dismiss'),
    // });
  }

  // Pure state
  setInitialState() {
    this._friendRequestsState.next(initialState);
  }

  setInboundFriendRequests(inboundFriendRequests: FriendRequest[]) {
    const currentState = this._friendRequestsState.value;
    if (!currentState.inboundFriendRequests) return;

    this._friendRequestsState.next({
      ...currentState,
      inboundFriendRequests: [...inboundFriendRequests].map(
        inboundFriendRequest => new FriendRequest(inboundFriendRequest)
      ),
    });
  }

  setOutboundFriendRequests(outboundFriendRequests: FriendRequest[]) {
    const currentState = this._friendRequestsState.value;
    if (!currentState.outboundFriendRequests) return;

    this._friendRequestsState.next({
      ...currentState,
      outboundFriendRequests: [...outboundFriendRequests].map(
        outboundFriendRequest => new FriendRequest(outboundFriendRequest)
      ),
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._friendRequestsState.value;
    this._friendRequestsState.next({ ...currentState, isLoading });
  }

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.setIsLoading(false);
    return of(null);
  };
}
