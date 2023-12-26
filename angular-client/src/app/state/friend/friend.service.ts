import { Injectable } from '@angular/core';
import { FriendStateService } from './friend.state.service';
import { FriendEffectService } from './friend.effect.service';
import { Friend } from './friend.model';
import { Observable } from 'rxjs';
import { User } from '../user/user.model';
import { FriendRequest } from '../friend-request/friend-requests.model';
import { Message } from '../message/message.model';
import { Presence } from 'src/app/types/presence/presence.type';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';
import { GameMap } from 'src/app/types/game-map/game-map.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { Activity } from 'src/app/types/activity/activity.type';

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

  setFriendActivity(friendId: string, activity: Activity): void {
    this.friendStateService.setFriendActivity(friendId, activity);
  }

  setFriendsActivity(friendIds: string[], activity: Activity): void {
    this.friendStateService.setFriendsActivity(friendIds, activity);
  }

  setFriendQueueType(friendId: string, queueType: QueueType): void {
    this.friendStateService.setFriendQueueType(friendId, queueType);
  }

  setFriendsQueueType(friendIds: string[], queueType: QueueType): void {
    this.friendStateService.setFriendsQueueType(friendIds, queueType);
  }

  setFriendGameType(friendId: string, gameType: GameType): void {
    this.friendStateService.setFriendGameType(friendId, gameType);
  }

  setFriendsGameType(friendIds: string[], gameType: GameType): void {
    this.friendStateService.setFriendsGameType(friendIds, gameType);
  }

  setFriendGameMode(friendId: string, gameMode: GameMode): void {
    this.friendStateService.setFriendGameMode(friendId, gameMode);
  }

  setFriendsGameMode(friendIds: string[], gameMode: GameMode): void {
    this.friendStateService.setFriendsGameMode(friendIds, gameMode);
  }

  setFriendGameMap(friendId: string, gameMap: GameMap): void {
    this.friendStateService.setFriendGameMap(friendId, gameMap);
  }

  setFriendsGameMap(friendIds: string[], gameMap: GameMap): void {
    this.friendStateService.setFriendsGameMap(friendIds, gameMap);
  }

  setFriendPresence(friendId: string, presence: Presence): void {
    this.friendStateService.setFriendPresence(friendId, presence);
  }

  setFriendsPresence(friendIds: string[], presence: Presence): void {
    this.friendStateService.setFriendsPresence(friendIds, presence);
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
