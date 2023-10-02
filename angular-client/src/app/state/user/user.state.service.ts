import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, of, catchError } from 'rxjs';
import { UserState, initialState } from './user.state';
import { User } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  isLoadingSelector,
  userFriendsSelector,
  userInboundFriendRequestsSelector,
  userOfflineFriendsSelector,
  userOnlineFriendsSelector,
  userOnlineSelector,
  userOutboundFriendRequestsSelector,
  userSelector,
} from './user.state.selectors';
import { Friend } from 'src/app/models/friend/friend';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private _userState = new BehaviorSubject<UserState>(initialState);

  public userState$: Observable<UserState> = this._userState.asObservable();
  public isLoading$ = isLoadingSelector(this.userState$);
  public user$ = userSelector(this.userState$);
  public userOnline$ = userOnlineSelector(this.user$);
  public userFriends$ = userFriendsSelector(this.user$);
  public userOnlineFriends$ = userOnlineFriendsSelector(this.user$);
  public userOfflineFriends$ = userOfflineFriendsSelector(this.user$);
  public userInboundFriendRequests$ = userInboundFriendRequestsSelector(
    this.user$
  );
  public userOutboundFriendRequests$ = userOutboundFriendRequestsSelector(
    this.user$
  );

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  updateUser(user: User): void {
    this.setIsLoading(true);
    this.userService
      .update(user)
      .pipe(
        tap(user => {
          this.setUser(user);
          this.setIsLoading(false);
          this.snackBar.open(
            'Your information has been successfully updated!',
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  deleteUser(user: User): void {
    this.setIsLoading(true);
    this.userService
      .delete(user)
      .pipe(
        tap(() => {
          this.setUser(null);
          this.setIsLoading(false);
          this.snackBar.open(
            'Your account has been successfully deleted!',
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  sendFriendRequest(potentialFriend: string) {
    const user = this._userState.value.user;
    this.setIsLoading(true);
    this.userService
      .createFriendRequest(user, potentialFriend)
      .pipe(
        tap(user => {
          this.setUserOutboundFriendRequests(user.outboundFriendRequests);
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

  acceptFriendRequest(friendRequest: FriendRequest) {
    const user = this._userState.value.user;
    this.setIsLoading(true);
    this.userService
      .addFriend(user, friendRequest._id)
      .pipe(
        tap(user => {
          this.setUserInboundFriendRequests(user.inboundFriendRequests);
          this.setUserFriends(user.friends);
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

  revokeFriendRequest(friendRequest: FriendRequest) {
    const user = this._userState.value.user;
    this.setIsLoading(true);
    this.userService
      .deleteFriendRequest(user, friendRequest._id)
      .pipe(
        tap(user => {
          this.setUserOutboundFriendRequests(user.outboundFriendRequests);
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

  rejectFriendRequest(friendRequest: FriendRequest) {
    const user = this._userState.value.user;
    this.setIsLoading(true);
    this.userService
      .deleteFriendRequest(user, friendRequest._id)
      .pipe(
        tap(user => {
          this.setUserInboundFriendRequests(user.inboundFriendRequests);
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

  removeFriend(friend: Friend) {
    const user = this._userState.value.user;
    this.setIsLoading(true);
    this.userService
      .removeFriend(user, friend._id)
      .pipe(
        tap(user => {
          this.setUserFriends(user.friends);
          this.setIsLoading(false);
          this.snackBar.open(
            `You and ${friend.username} are no longer friends`,
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(this.handleError)
      )
      .subscribe();
    // this.socialService.removeFriend(friend).subscribe({
    //   next: async host => {
    //     this.colyseusService.host = new User(host);
    //     const room: Colyseus.Room =
    //       this.colyseusService.onlineFriendsRooms.find(
    //         room => room.id === friend._id
    //       );
    //     if (room) {
    //       room.send('removeFriend', host);
    //       this.colyseusService.leaveRoom(room);
    //     } else {
    //       this.colyseusService.hostRoom.send('disconnectFriend', friend);
    //     }
    //     this.updateFriends();
    //     this.openSnackBar('Unfriended ' + friend.username, 'Dismiss');
    //   },
    //   error: error => this.openSnackBar(error, 'Dismiss'),
    // });
  }

  // Everything below this line has no API effects and is purely state logic

  setInitialState() {
    this._userState.next(initialState);
  }

  setUser(user: User): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, user: new User(user) });
  }

  setUserOnline(online: boolean): void {
    const currentState = this._userState.value;
    if (!currentState.user) return;
    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, online } as User),
    });
  }

  setUserFriendOnline(friendId: string): void {
    const currentState = this._userState.value;
    if (!currentState.user) return;

    const friendIndex = currentState.user.friends.findIndex(
      friend => friend._id === friendId
    );

    if (friendIndex === -1) return; // if the friend with the given ID is not found

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.user.friends];

    // Update the online status of the specified friend
    updatedFriends[friendIndex] = {
      ...updatedFriends[friendIndex],
      online: true,
    };

    // Remove the friend from its current position and add to the start of the array
    const friendToMove = updatedFriends.splice(friendIndex, 1)[0];
    updatedFriends.unshift(friendToMove);

    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, friends: updatedFriends } as User),
    });
  }

  setUserFriendsOnline(friendIds: string[]): void {
    const currentState = this._userState.value;
    if (!currentState.user) return;

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.user.friends];

    friendIds.forEach(friendId => {
      const friendIndex = updatedFriends.findIndex(
        friend => friend._id === friendId
      );
      if (friendIndex === -1) return; // if the friend with the given ID is not found

      // Update the online status of the specified friend
      updatedFriends[friendIndex] = {
        ...updatedFriends[friendIndex],
        online: true,
      };

      // Remove the friend from its current position and add to the start of the array
      const friendToMove = updatedFriends.splice(friendIndex, 1)[0];
      updatedFriends.unshift(friendToMove);
    });

    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, friends: updatedFriends } as User),
    });
  }

  setUserFriendOffline(friendId: string): void {
    const currentState = this._userState.value;
    if (!currentState.user) return;

    const friendIndex = currentState.user.friends.findIndex(
      friend => friend._id === friendId
    );

    if (friendIndex === -1) return; // if the friend with the given ID is not found

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.user.friends];

    // Update the online status of the specified friend
    updatedFriends[friendIndex] = {
      ...updatedFriends[friendIndex],
      online: false,
    };

    // Remove the friend from its current position and push to the end of the array
    const friendToMove = updatedFriends.splice(friendIndex, 1)[0];
    updatedFriends.push(friendToMove);

    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, friends: updatedFriends } as User),
    });
  }

  setUserFriendsOffline(friendIds: string[]): void {
    const currentState = this._userState.value;
    if (!currentState.user) return;

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.user.friends];

    friendIds.forEach(friendId => {
      const friendIndex = updatedFriends.findIndex(
        friend => friend._id === friendId
      );
      if (friendIndex === -1) return; // if the friend with the given ID is not found

      // Update the online status of the specified friend
      updatedFriends[friendIndex] = {
        ...updatedFriends[friendIndex],
        online: false,
      };

      // Remove the friend from its current position and push to the end of the array
      const friendToMove = updatedFriends.splice(friendIndex, 1)[0];
      updatedFriends.push(friendToMove);
    });

    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, friends: updatedFriends } as User),
    });
  }

  setUserFriends(friends: Friend[]) {
    const currentState = this._userState.value;
    if (!currentState.user) return;

    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, friends: [...friends] } as User),
    });
  }

  setUserInboundFriendRequests(inboundFriendRequests: FriendRequest[]) {
    const currentState = this._userState.value;
    if (!currentState.user) return;

    this._userState.next({
      ...currentState,
      user: new User({
        ...currentState.user,
        inboundFriendRequests: [...inboundFriendRequests],
      } as User),
    });
  }

  setUserOutboundFriendRequests(outboundFriendRequests: FriendRequest[]) {
    const currentState = this._userState.value;
    if (!currentState.user) return;

    this._userState.next({
      ...currentState,
      user: new User({
        ...currentState.user,
        outboundFriendRequests: [...outboundFriendRequests],
      } as User),
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, isLoading });
  }

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.setIsLoading(false);
    return of(null);
  };
}
