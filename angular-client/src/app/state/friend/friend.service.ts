import { Injectable } from '@angular/core';
import { FriendStateService } from './friend.state.service';
import { FriendEffectService } from './friend.effect.service';
import { Friend } from './friend.model';
import { Observable } from 'rxjs';
import { User } from '../user/user.model';
import { FriendRequest } from '../friend-request/friend-requests.model';
import { Message } from '../message/message.model';
import { Status } from 'src/app/models/status/status.model';
import { Presence } from 'src/app/types/presence/presence.type';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  get friendState$() {
    return this.friendStateService.friendState$;
  }

  get isLoading$() {
    return this.friendStateService.isLoading$;
  }

  get friends$() {
    return this.friendStateService.friends$;
  }

  get onlineFriends$() {
    return this.friendStateService.onlineFriends$;
  }

  get offlineFriends$() {
    return this.friendStateService.offlineFriends$;
  }

  get awayFriends$() {
    return this.friendStateService.awayFriends$;
  }

  constructor(
    private friendEffectService: FriendEffectService,
    private friendStateService: FriendStateService
  ) {}

  addNewFriend(user: User, friendRequest: FriendRequest): Observable<User> {
    return this.friendEffectService.addFriend(user, friendRequest);
  }

  deleteFriend(user: User, friend: Friend): Observable<Friend> {
    return this.friendEffectService.deleteFriend(user, friend);
  }

  setInitialState(): void {
    this.friendStateService.setInitialState();
  }

  setFriends(friends: Friend[]): void {
    this.friendStateService.setFriends(friends);
  }

  setFriendIsTyping(friendId: string, isTyping: boolean): void {
    this.friendStateService.setFriendIsTyping(friendId, isTyping);
  }

  setFriendStatus(friendId: string, status: Status): void {
    this.friendStateService.setFriendStatus(friendId, status);
  }

  setFriendsStatus(friendIds: string[], status: Status): void {
    this.friendStateService.setFriendsStatus(friendIds, status);
  }

  updateFriendStatus(friendId: string, status: Partial<Status>): void {
    this.friendStateService.updateFriendStatus(friendId, status);
  }

  updateFriendsStatus(friendIds: string[], status: Partial<Status>): void {
    this.friendStateService.updateFriendsStatus(friendIds, status);
  }

  updateFriendPresence(friendId: string, presence: Presence): void {
    this.friendStateService.updateFriendPresence(friendId, presence);
  }

  updateFriendsPresence(friendIds: string[], presence: Presence): void {
    this.friendStateService.updateFriendsPresence(friendIds, presence);
  }

  addFriend(friend: Friend): void {
    this.friendStateService.addFriend(friend);
  }

  removeFriend(friend: Friend): void {
    this.friendStateService.removeFriend(friend);
  }

  reorderFriend(friendId: string, position: 'front' | 'end'): void {
    this.friendStateService.reorderFriend(friendId, position);
  }

  sortFriendsByUnviewedMessages(unviewedMessages: Message[]) {
    this.friendStateService.sortFriendsByUnviewedMessages(unviewedMessages);
  }
}
