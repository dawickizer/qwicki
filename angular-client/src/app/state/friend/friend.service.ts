import { Injectable } from '@angular/core';
import { FriendStateService } from './friend.state.service';
import { FriendEffectService } from './friend.effect.service';
import { Friend } from './friend.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
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

  constructor(
    private friendEffectService: FriendEffectService,
    private friendStateService: FriendStateService
  ) {}

  deleteFriend(friend: Friend): Observable<Friend> {
    return this.friendEffectService.deleteFriend(friend);
  }

  setFriends(friends: Friend[]) {
    this.friendStateService.setFriends(friends);
  }

  setFriendOnline(friendId: string) {
    this.friendStateService.setFriendOnline(friendId);
  }

  setFriendsOnline(friendIds: string[]) {
    this.friendStateService.setFriendsOnline(friendIds);
  }

  setFriendOffline(friendId: string) {
    this.friendStateService.setFriendOffline(friendId);
  }

  setFriendsOffline(friendIds: string[]) {
    this.friendStateService.setFriendsOffline(friendIds);
  }

  addFriend(friend: Friend) {
    this.friendStateService.addFriend(friend);
  }

  removeFriend(friend: Friend) {
    this.friendStateService.removeFriend(friend);
  }
}
