import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FriendState, initialState } from './friend.state';
import {
  friendsSelector,
  isLoadingSelector,
  offlineFriendsSelector,
  onlineFriendsSelector,
} from './friend.state.selectors';
import { Friend } from './friend.model';
import { Message } from '../message/message.model';

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

  setInitialState() {
    this._friendState.next(initialState);
  }

  reorderFriend(friendId: string, position: 'front' | 'end'): void {
    const currentState = this._friendState.value;
    if (!currentState.friends) return;

    const friendIndex = currentState.friends.findIndex(
      friend => friend._id === friendId
    );

    if (friendIndex === -1) return; // if the friend with the given ID is not found

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.friends];

    const friendToMove = updatedFriends.splice(friendIndex, 1)[0];

    if (position === 'front') {
      updatedFriends.unshift(friendToMove);
    } else {
      updatedFriends.push(friendToMove);
    }

    this._friendState.next({
      ...currentState,
      friends: updatedFriends.map(friend => new Friend(friend)),
    });
  }

  setFriendIsTyping(friendId: string, isTyping: boolean): void {
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
      isTyping,
    };

    this._friendState.next({
      ...currentState,
      friends: updatedFriends.map(friend => new Friend(friend)),
    });
  }

  setFriendOnline(friendId: string): void {
    this.updateFriendStatus(friendId, true);
    this.reorderFriend(friendId, 'front');
  }

  setFriendsOnline(friendIds: string[]): void {
    friendIds.forEach(friendId => {
      this.setFriendOnline(friendId);
    });
  }

  setFriendOffline(friendId: string): void {
    this.updateFriendStatus(friendId, false);
    this.reorderFriend(friendId, 'end');
  }

  setFriendsOffline(friendIds: string[]): void {
    friendIds.forEach(friendId => {
      this.setFriendOffline(friendId);
    });
  }

  private updateFriendStatus(friendId: string, online: boolean): void {
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
      online,
    };

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

  sortFriendsByUnviewedMessages(unviewedMessages: Message[]) {
    const currentState = this._friendState.value;
    if (!currentState.friends) return;
    const sortedFriends = [...currentState.friends];

    sortedFriends.sort((a, b) => {
      // Check if friend A and friend B have unviewed messages
      const aHasUnviewedMessages = unviewedMessages.some(
        msg => msg.from._id === a._id
      );
      const bHasUnviewedMessages = unviewedMessages.some(
        msg => msg.from._id === b._id
      );

      // Online with unviewed messages.
      if (
        a.online &&
        aHasUnviewedMessages &&
        (!b.online || !bHasUnviewedMessages)
      ) {
        return -1;
      }
      if (
        b.online &&
        bHasUnviewedMessages &&
        (!a.online || !aHasUnviewedMessages)
      ) {
        return 1;
      }

      // Online without unviewed messages.
      if (
        a.online &&
        !aHasUnviewedMessages &&
        (!b.online || bHasUnviewedMessages)
      ) {
        return -1;
      }
      if (
        b.online &&
        !bHasUnviewedMessages &&
        (!a.online || aHasUnviewedMessages)
      ) {
        return 1;
      }

      // Offline with unviewed messages.
      if (
        !a.online &&
        aHasUnviewedMessages &&
        (b.online || !bHasUnviewedMessages)
      ) {
        return -1;
      }
      if (
        !b.online &&
        bHasUnviewedMessages &&
        (a.online || !aHasUnviewedMessages)
      ) {
        return 1;
      }

      // Offline without unviewed messages.
      // If it reaches this point, it means both a and b are offline without unviewed messages, hence they are equal in terms of sorting.
      return 0;
    });
    this.setFriends(sortedFriends);
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._friendState.value;
    this._friendState.next({ ...currentState, isLoading });
  }
}
