import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FriendState, initialState } from './friend.state';
import {
  friendsSelector,
  isLoadingSelector,
  offlineFriendsSelector,
  onlineFriendsSelector,
} from './friend.state.selectors';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Friend } from './friend.model';

@Injectable({
  providedIn: 'root',
})
export class FriendStateService {
  private _friendState = new BehaviorSubject<FriendState>(initialState);

  public friendState$: Observable<FriendState> =
    this._friendState.asObservable();
  public isLoading$ = isLoadingSelector(this.friendState$);
  public friends$ = friendsSelector(this.friendState$);
  public onlineFriends$ = onlineFriendsSelector(this.friends$);
  public offlineFriends$ = offlineFriendsSelector(this.friends$);

  constructor(private snackBar: MatSnackBar) {}

  setInitialState() {
    this._friendState.next(initialState);
  }

  setFriendOnline(friendId: string): void {
    const currentState = this._friendState.value;
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

    this._friendState.next({
      ...currentState,
      friends: updatedFriends.map(friend => new Friend(friend)),
    });
  }

  setFriendsOnline(friendIds: string[]): void {
    const currentState = this._friendState.value;
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

    this._friendState.next({
      ...currentState,
      friends: updatedFriends.map(friend => new Friend(friend)),
    });
  }

  setFriendOffline(friendId: string): void {
    const currentState = this._friendState.value;
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

    this._friendState.next({
      ...currentState,
      friends: updatedFriends.map(friend => new Friend(friend)),
    });
  }

  setFriendsOffline(friendIds: string[]): void {
    const currentState = this._friendState.value;
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

    this._friendState.next({
      ...currentState,
      friends: updatedFriends.map(friend => new Friend(friend)),
    });
  }

  setFriends(friends: Friend[]): void {
    const currentState = this._friendState.value;
    if (!currentState.friends) return;
    this._friendState.next({
      ...currentState,
      friends: [...friends].map(friend => new Friend(friend)),
    });
  }

  addFriend(friend: Friend): void {
    const currentState = this._friendState.value;
    if (!currentState.friends) return;

    const updatedFriends = [...currentState.friends, friend];
    this._friendState.next({
      ...currentState,
      friends: updatedFriends,
    });
  }

  removeFriend(friend: Friend): void {
    const currentState = this._friendState.value;
    if (!currentState.friends) return;

    const updatedFriends = currentState.friends.filter(
      current => current._id !== friend._id
    );

    this._friendState.next({
      ...currentState,
      friends: updatedFriends,
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._friendState.value;
    this._friendState.next({ ...currentState, isLoading });
  }

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.setIsLoading(false);
    return of(null);
  };
}
