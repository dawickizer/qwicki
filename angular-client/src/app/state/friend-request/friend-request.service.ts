import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';
import { FriendRequestEffectService } from './friend-request.effect.service';
import { FriendRequestStateService } from './friend-request.state.service';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root',
})
export class FriendRequestService {
  get isLoading$(): Observable<boolean> {
    return this.friendRequestStateService.isLoading$;
  }

  get inboundFriendRequests$(): Observable<FriendRequest[]> {
    return this.friendRequestStateService.inboundFriendRequests$;
  }

  get outboundFriendRequests$(): Observable<FriendRequest[]> {
    return this.friendRequestStateService.outboundFriendRequests$;
  }

  constructor(
    private friendRequestEffectService: FriendRequestEffectService,
    private friendRequestStateService: FriendRequestStateService
  ) {}

  sendFriendRequest(potentialFriend: string): Observable<FriendRequest> {
    return this.friendRequestEffectService.sendFriendRequest(potentialFriend);
  }

  acceptFriendRequest(friendRequest: FriendRequest): Observable<User> {
    return this.friendRequestEffectService.acceptFriendRequest(friendRequest);
  }

  revokeFriendRequest(friendRequest: FriendRequest): Observable<FriendRequest> {
    return this.friendRequestEffectService.revokeFriendRequest(friendRequest);
  }

  rejectFriendRequest(friendRequest: FriendRequest): Observable<FriendRequest> {
    return this.friendRequestEffectService.rejectFriendRequest(friendRequest);
  }

  setInitialState(): void {
    this.friendRequestStateService.setInitialState();
  }

  setInboundFriendRequests(inboundFriendRequests: FriendRequest[]): void {
    this.friendRequestStateService.setInboundFriendRequests(
      inboundFriendRequests
    );
  }

  addInboundFriendRequest(friendRequest: FriendRequest): void {
    this.friendRequestStateService.addInboundFriendRequest(friendRequest);
  }

  removeInboundFriendRequest(friendRequest: FriendRequest): void {
    this.friendRequestStateService.removeInboundFriendRequest(friendRequest);
  }

  setOutboundFriendRequests(outboundFriendRequests: FriendRequest[]): void {
    this.friendRequestStateService.setOutboundFriendRequests(
      outboundFriendRequests
    );
  }

  addOutboundFriendRequest(friendRequest: FriendRequest): void {
    this.friendRequestStateService.addOutboundFriendRequest(friendRequest);
  }

  removeOutboundFriendRequest(friendRequest: FriendRequest): void {
    this.friendRequestStateService.removeOutboundFriendRequest(friendRequest);
  }

  setIsLoading(isLoading: boolean): void {
    this.friendRequestStateService.setIsLoading(isLoading);
  }
}
