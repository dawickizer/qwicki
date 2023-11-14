import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { FriendRequestEffectService } from './friend-request.effect.service';
import { FriendRequestStateService } from './friend-request.state.service';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root',
})
export class FriendRequestService {
  get friendRequestState$() {
    return this.friendRequestStateService.friendRequestState$;
  }

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

  sendFriendRequest(
    user: User,
    potentialFriend: string
  ): Observable<FriendRequest> {
    return this.friendRequestEffectService.sendFriendRequest(
      user,
      potentialFriend
    );
  }

  revokeFriendRequest(
    user: User,
    friendRequest: FriendRequest
  ): Observable<FriendRequest> {
    return this.friendRequestEffectService.revokeFriendRequest(
      user,
      friendRequest
    );
  }

  rejectFriendRequest(
    user: User,
    friendRequest: FriendRequest
  ): Observable<FriendRequest> {
    return this.friendRequestEffectService.rejectFriendRequest(
      user,
      friendRequest
    );
  }

  receiveFriendRequest(
    friendRequest: FriendRequest
  ): Observable<FriendRequest> {
    return this.friendRequestEffectService.receiveFriendRequest(friendRequest);
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
