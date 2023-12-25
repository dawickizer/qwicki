import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FriendState, initialState } from './friend.state';
import {
  awayFriendsSelector,
  friendsSelector,
  isLoadingSelector,
  offlineFriendsSelector,
  onlineFriendsSelector,
} from './friend.state.selectors';
import { Friend } from './friend.model';
import { Message } from '../message/message.model';
import { Status } from 'src/app/models/status/status.model';
import { Presence } from 'src/app/types/presence/presence.type';

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
  public awayFriends$ = awayFriendsSelector(this.friends$);

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

    if (friendIndex === -1) return;

    const updatedFriends = [...currentState.friends];

    updatedFriends[friendIndex] = {
      ...updatedFriends[friendIndex],
      isTyping,
    };

    this._friendState.next({
      ...currentState,
      friends: updatedFriends.map(friend => new Friend(friend)),
    });
  }

  setFriendStatus(friendId: string, status: Status): void {
    this.setFriendStatusHelper(friendId, status);
  }

  setFriendsStatus(friendIds: string[], status: Status): void {
    friendIds.forEach(friendId => {
      this.setFriendStatus(friendId, status);
    });
  }

  private setFriendStatusHelper(friendId: string, status: Status): void {
    const currentState = this._friendState.value;
    if (!currentState.friends) return;

    const friendIndex = currentState.friends.findIndex(
      friend => friend._id === friendId
    );

    if (friendIndex === -1) return; // if the friend with the given ID is not found

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.friends];

    // Update the status of the specified friend
    updatedFriends[friendIndex] = {
      ...updatedFriends[friendIndex],
      status: Object.keys(status).length === 0 ? new Status() : status,
    };

    this._friendState.next({
      ...currentState,
      friends: updatedFriends.map(friend => new Friend(friend)),
    });
  }

  updateFriendStatus(friendId: string, status: Partial<Status>): void {
    this.updateFriendStatusHelper(friendId, status);
  }

  updateFriendsStatus(friendIds: string[], status: Partial<Status>): void {
    friendIds.forEach(friendId => {
      this.updateFriendStatus(friendId, status);
    });
  }

  private updateFriendStatusHelper(
    friendId: string,
    status: Partial<Status>
  ): void {
    const currentState = this._friendState.value;
    if (!currentState.friends) return;

    const friendIndex = currentState.friends.findIndex(
      friend => friend._id === friendId
    );

    if (friendIndex === -1) return; // if the friend with the given ID is not found

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.friends];

    // Merge new status with existing status
    const updatedStatus = {
      ...updatedFriends[friendIndex].status,
      ...status,
    };

    // Update the status of the specified friend
    updatedFriends[friendIndex] = new Friend({
      ...updatedFriends[friendIndex],
      status: updatedStatus,
    });

    this._friendState.next({
      ...currentState,
      friends: updatedFriends.map(friend => new Friend(friend)),
    });
  }

  updateFriendPresence(friendId: string, presence: Presence): void {
    this.updateFriendPresenceHelper(friendId, presence);
    if (presence === 'Online') this.reorderFriend(friendId, 'front');
    else if (presence === 'Offline') this.reorderFriend(friendId, 'end');
  }

  updateFriendsPresence(friendIds: string[], presence: Presence): void {
    friendIds.forEach(friendId => {
      this.updateFriendPresence(friendId, presence);
    });
  }

  private updateFriendPresenceHelper(
    friendId: string,
    presence: Presence
  ): void {
    const currentState = this._friendState.value;
    if (!currentState.friends) return;

    const friendIndex = currentState.friends.findIndex(
      friend => friend._id === friendId
    );

    if (friendIndex === -1) return; // if the friend with the given ID is not found

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.friends];

    // Update the presence of the specified friend
    updatedFriends[friendIndex] = {
      ...updatedFriends[friendIndex],
      presence: presence ? presence : 'Offline',
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

    const updatedFriends = [new Friend(friend), ...currentState.friends];
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
      const aUnviewedMessagesCount = unviewedMessages.filter(
        msg => msg.from._id === a._id
      ).length;
      const bUnviewedMessagesCount = unviewedMessages.filter(
        msg => msg.from._id === b._id
      ).length;

      // Define a priority map
      const statusPriority = {
        Online: 1,
        Away: 2,
        Offline: 3,
      };

      // Calculate the sort priority
      const aPriority =
        statusPriority[a.presence] * 10 + (aUnviewedMessagesCount > 0 ? 0 : 1);
      const bPriority =
        statusPriority[b.presence] * 10 + (bUnviewedMessagesCount > 0 ? 0 : 1);

      return aPriority - bPriority;
    });

    this.setFriends(sortedFriends);
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._friendState.value;
    this._friendState.next({ ...currentState, isLoading });
  }
}
