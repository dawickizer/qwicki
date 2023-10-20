import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FriendRequestState, initialState } from './friend-request.state';
import {
  isLoadingSelector,
  inboundFriendRequestsSelector,
  outboundFriendRequestsSelector,
} from './friend-request.state.selectors';
import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class FriendRequestStateService {
  private _friendRequestState = new BehaviorSubject<FriendRequestState>(
    initialState
  );

  public friendRequestState$: Observable<FriendRequestState> =
    this._friendRequestState.asObservable();
  public isLoading$ = isLoadingSelector(this.friendRequestState$);
  public inboundFriendRequests$ = inboundFriendRequestsSelector(
    this.friendRequestState$
  );
  public outboundFriendRequests$ = outboundFriendRequestsSelector(
    this.friendRequestState$
  );

  constructor(private snackBar: MatSnackBar) {}

  setInitialState() {
    this._friendRequestState.next(initialState);
  }

  setInboundFriendRequests(inboundFriendRequests: FriendRequest[]) {
    const currentState = this._friendRequestState.value;
    if (!currentState.inboundFriendRequests) return;

    this._friendRequestState.next({
      ...currentState,
      inboundFriendRequests: [...inboundFriendRequests].map(
        inboundFriendRequest => new FriendRequest(inboundFriendRequest)
      ),
    });
  }

  addInboundFriendRequest(friendRequest: FriendRequest): void {
    const currentState = this._friendRequestState.value;
    if (!currentState.inboundFriendRequests) return;

    const updatedInboundFriendRequests = [
      ...currentState.inboundFriendRequests,
      friendRequest,
    ];
    this._friendRequestState.next({
      ...currentState,
      inboundFriendRequests: updatedInboundFriendRequests,
    });
  }

  removeInboundFriendRequest(friendRequest: FriendRequest): void {
    const currentState = this._friendRequestState.value;
    if (!currentState.inboundFriendRequests) return;

    const updatedInboundFriendRequests =
      currentState.inboundFriendRequests.filter(
        inboundFriendRequest => inboundFriendRequest._id !== friendRequest._id
      );

    this._friendRequestState.next({
      ...currentState,
      inboundFriendRequests: updatedInboundFriendRequests,
    });
  }

  setOutboundFriendRequests(outboundFriendRequests: FriendRequest[]) {
    const currentState = this._friendRequestState.value;
    if (!currentState.outboundFriendRequests) return;

    this._friendRequestState.next({
      ...currentState,
      outboundFriendRequests: [...outboundFriendRequests].map(
        outboundFriendRequest => new FriendRequest(outboundFriendRequest)
      ),
    });
  }

  addOutboundFriendRequest(friendRequest: FriendRequest): void {
    const currentState = this._friendRequestState.value;
    if (!currentState.outboundFriendRequests) return;

    const updatedOutboundFriendRequests = [
      ...currentState.outboundFriendRequests,
      friendRequest,
    ];
    this._friendRequestState.next({
      ...currentState,
      outboundFriendRequests: updatedOutboundFriendRequests,
    });
  }

  removeOutboundFriendRequest(friendRequest: FriendRequest): void {
    const currentState = this._friendRequestState.value;
    if (!currentState.outboundFriendRequests) return;

    const updatedOutboundFriendRequests =
      currentState.outboundFriendRequests.filter(
        outboundFriendRequest => outboundFriendRequest._id !== friendRequest._id
      );

    this._friendRequestState.next({
      ...currentState,
      outboundFriendRequests: updatedOutboundFriendRequests,
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._friendRequestState.value;
    this._friendRequestState.next({ ...currentState, isLoading });
  }
}
