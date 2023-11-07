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
import { OnlineStatus } from 'src/app/models/online-status/online-status';

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

  setFriendOnlineStatus(friendId: string, onlineStatus: OnlineStatus): void {
    this.updateFriendOnlineStatus(friendId, onlineStatus);
    if (onlineStatus === 'online') this.reorderFriend(friendId, 'front');
    else if (onlineStatus === 'offline') this.reorderFriend(friendId, 'end');
  }

  setFriendsOnlineStatus(
    friendIds: string[],
    onlineStatus: OnlineStatus
  ): void {
    friendIds.forEach(friendId => {
      this.setFriendOnlineStatus(friendId, onlineStatus);
    });
  }

  private updateFriendOnlineStatus(
    friendId: string,
    onlineStatus: OnlineStatus
  ): void {
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
      onlineStatus,
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

    const updatedFriends = [friend, ...currentState.friends];
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
        online: 1,
        away: 2,
        offline: 3,
      };

      // Calculate the sort priority
      const aPriority =
        statusPriority[a.onlineStatus] * 10 +
        (aUnviewedMessagesCount > 0 ? 0 : 1);
      const bPriority =
        statusPriority[b.onlineStatus] * 10 +
        (bUnviewedMessagesCount > 0 ? 0 : 1);

      return aPriority - bPriority;
    });

    this.setFriends(sortedFriends);
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._friendState.value;
    this._friendState.next({ ...currentState, isLoading });
  }
}
