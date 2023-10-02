import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, catchError } from 'rxjs';
import { FriendsState, initialState } from './friends.state';
import {
  friendsSelector,
  isLoadingSelector,
  offlineFriendsSelector,
  onlineFriendsSelector,
} from './friends.state.selectors';
import { Friend } from 'src/app/models/friend/friend';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user/user';

@Injectable({
  providedIn: 'root',
})
export class FriendsStateService {
  private _friendsState = new BehaviorSubject<FriendsState>(initialState);

  public friendsState$: Observable<FriendsState> =
    this._friendsState.asObservable();
  public isLoading$ = isLoadingSelector(this.friendsState$);
  public friends$ = friendsSelector(this.friendsState$);
  public onlineFriends$ = onlineFriendsSelector(this.friends$);
  public offlineFriends$ = offlineFriendsSelector(this.friends$);

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  // Side effects
  removeFriend(user: User, friend: Friend): void {
    this.setIsLoading(true);
    this.userService
      .removeFriend(user, friend._id)
      .pipe(
        tap(user => {
          this.setFriends(user.friends);
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

  // Pure state
  setInitialState() {
    this._friendsState.next(initialState);
  }

  setFriendOnline(friendId: string): void {
    const currentState = this._friendsState.value;
    if (!currentState.friends) return;

    const friendIndex = currentState.friends.findIndex(
      friend => friend._id === friendId
    );

    if (friendIndex === -1) return; // if the friend with the given ID is not found

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.friends];

    // Update the online status of the specified friend
    updatedFriends[friendIndex] = {
      ...updatedFriends[friendIndex],
      online: true,
    };

    // Remove the friend from its current position and add to the start of the array
    const friendToMove = updatedFriends.splice(friendIndex, 1)[0];
    updatedFriends.unshift(friendToMove);

    updatedFriends.map(friend => new Friend(friend));

    this._friendsState.next({
      ...currentState,
      friends: updatedFriends.map(friend => new Friend(friend)),
    });
  }

  setFriendsOnline(friendIds: string[]): void {
    const currentState = this._friendsState.value;
    if (!currentState.friends) return;

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.friends];

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

    this._friendsState.next({
      ...currentState,
      friends: updatedFriends.map(friend => new Friend(friend)),
    });
  }

  setFriendOffline(friendId: string): void {
    const currentState = this._friendsState.value;
    if (!currentState.friends) return;

    const friendIndex = currentState.friends.findIndex(
      friend => friend._id === friendId
    );

    if (friendIndex === -1) return; // if the friend with the given ID is not found

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.friends];

    // Update the online status of the specified friend
    updatedFriends[friendIndex] = {
      ...updatedFriends[friendIndex],
      online: false,
    };

    // Remove the friend from its current position and push to the end of the array
    const friendToMove = updatedFriends.splice(friendIndex, 1)[0];
    updatedFriends.push(friendToMove);

    this._friendsState.next({
      ...currentState,
      friends: updatedFriends.map(friend => new Friend(friend)),
    });
  }

  setFriendsOffline(friendIds: string[]): void {
    const currentState = this._friendsState.value;
    if (!currentState.friends) return;

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.friends];

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

    this._friendsState.next({
      ...currentState,
      friends: updatedFriends.map(friend => new Friend(friend)),
    });
  }

  setFriends(friends: Friend[]) {
    const currentState = this._friendsState.value;
    if (!currentState.friends) return;
    this._friendsState.next({
      ...currentState,
      friends: [...friends].map(friend => new Friend(friend)),
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._friendsState.value;
    this._friendsState.next({ ...currentState, isLoading });
  }

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.setIsLoading(false);
    return of(null);
  };
}
