import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FriendRequestsState, initialState } from './friend-requests.state';
import {
  isLoadingSelector,
  inboundFriendRequestsSelector,
  outboundFriendRequestsSelector,
} from './friend-requests.state.selectors';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';

@Injectable({
  providedIn: 'root',
})
export class FriendRequestsStateService {
  private _friendRequestsState = new BehaviorSubject<FriendRequestsState>(
    initialState
  );

  public friendRequestsState$: Observable<FriendRequestsState> =
    this._friendRequestsState.asObservable();
  public isLoading$ = isLoadingSelector(this.friendRequestsState$);
  public inboundFriendRequests$ = inboundFriendRequestsSelector(
    this.friendRequestsState$
  );
  public outboundFriendRequests$ = outboundFriendRequestsSelector(
    this.friendRequestsState$
  );

  setInitialState() {
    this._friendRequestsState.next(initialState);
  }

  setInboundFriendRequests(inboundFriendRequests: FriendRequest[]) {
    const currentState = this._friendRequestsState.value;
    if (!currentState.inboundFriendRequests) return;

    this._friendRequestsState.next({
      ...currentState,
      inboundFriendRequests: [...inboundFriendRequests].map(
        inboundFriendRequest => new FriendRequest(inboundFriendRequest)
      ),
    });
  }

  setOutboundFriendRequests(outboundFriendRequests: FriendRequest[]) {
    const currentState = this._friendRequestsState.value;
    if (!currentState.outboundFriendRequests) return;

    this._friendRequestsState.next({
      ...currentState,
      outboundFriendRequests: [...outboundFriendRequests].map(
        outboundFriendRequest => new FriendRequest(outboundFriendRequest)
      ),
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._friendRequestsState.value;
    this._friendRequestsState.next({ ...currentState, isLoading });
  }
}
