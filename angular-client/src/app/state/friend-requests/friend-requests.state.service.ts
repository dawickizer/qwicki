import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, of, catchError } from 'rxjs';
import { FriendRequestsState, initialState } from './friend-requests.state';
import {
  isLoadingSelector,
  inboundFriendRequestsSelector,
  outboundFriendRequestsSelector,
} from './friend-requests.state.selectors';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FriendsStateService } from '../friends/friends.state.service';
import { UserStateService } from '../user/user.state.service';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { AuthStateService } from '../auth/auth.state.service';
import { FriendRequestApiService } from './friend-request.api.service';
import { FriendApiService } from '../friends/friend.api.service';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root',
})
export class FriendRequestsStateService {
  private user: User;
  private jwt: string;

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

  constructor(
    private friendRequestApiService: FriendRequestApiService,
    private friendApiService: FriendApiService,
    private friendsStateService: FriendsStateService,
    private userStateService: UserStateService,
    private authStateService: AuthStateService,
    private colyseusService: ColyseusService,
    private snackBar: MatSnackBar
  ) {
    this.subscribeToAuthState();
    this.subscribeToUserState();
  }

  private subscribeToUserState() {
    this.userStateService.user$.subscribe(user => {
      this.user = user;
    });
  }

  private subscribeToAuthState() {
    this.authStateService.jwt$.subscribe(jwt => {
      this.jwt = jwt;
    });
  }

  // Side effects
  sendFriendRequest(potentialFriend: string) {
    this.setIsLoading(true);
    this.friendRequestApiService
      .create(this.user, potentialFriend)
      .pipe(
        tap(async friendRequest => {
          this.addOutboundFriendRequest(friendRequest);
          this.setIsLoading(false);
          const room = await this.colyseusService.joinExistingRoomIfPresent(
            friendRequest.to._id,
            this.jwt
          );
          if (room) {
            room.send('sendFriendRequest', friendRequest);
            this.colyseusService.leaveRoom(room);
          }
          this.snackBar.open(
            `Friend Request sent to ${potentialFriend}`,
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  acceptFriendRequest(friendRequest: FriendRequest): void {
    this.setIsLoading(true);
    this.friendApiService
      .add(this.user, friendRequest._id)
      .pipe(
        tap(async user => {
          this.setInboundFriendRequests(user.inboundFriendRequests);
          this.friendsStateService.setFriends(user.friends);
          const room = await this.colyseusService.joinExistingRoomIfPresent(
            friendRequest.from._id,
            this.jwt
          );
          if (room) {
            room.send('acceptFriendRequest', friendRequest);
            this.colyseusService.leaveRoom(room);
          }
          this.setIsLoading(false);
          this.snackBar.open(
            `You and ${friendRequest.from.username} are now friends`,
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  revokeFriendRequest(friendRequest: FriendRequest): void {
    this.setIsLoading(true);
    this.friendRequestApiService
      .delete(this.user, friendRequest._id)
      .pipe(
        tap(async friendRequest => {
          this.removeOutboundFriendRequest(friendRequest);
          this.setIsLoading(false);
          const room = await this.colyseusService.joinExistingRoomIfPresent(
            friendRequest.to._id,
            this.jwt
          );
          if (room) {
            room.send('revokeFriendRequest', friendRequest);
            this.colyseusService.leaveRoom(room);
          }
          this.snackBar.open(
            `Friend Request unsent to ${friendRequest.to.username}`,
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  rejectFriendRequest(friendRequest: FriendRequest): void {
    this.setIsLoading(true);
    this.friendRequestApiService
      .delete(this.user, friendRequest._id)
      .pipe(
        tap(async friendRequest => {
          this.removeInboundFriendRequest(friendRequest);
          this.setIsLoading(false);
          const room = await this.colyseusService.joinExistingRoomIfPresent(
            friendRequest.from._id,
            this.jwt
          );
          if (room) {
            room.send('rejectFriendRequest', friendRequest);
            this.colyseusService.leaveRoom(room);
          }
          this.snackBar.open(
            `Friend Request from ${friendRequest.from.username} rejected`,
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  // Pure state
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

  addInboundFriendRequest(friendRequest: FriendRequest): void {
    const currentState = this._friendRequestsState.value;
    if (!currentState.inboundFriendRequests) return;

    const updatedInboundFriendRequests = [
      ...currentState.inboundFriendRequests,
      friendRequest,
    ];
    this._friendRequestsState.next({
      ...currentState,
      inboundFriendRequests: updatedInboundFriendRequests,
    });
  }

  removeInboundFriendRequest(friendRequest: FriendRequest): void {
    const currentState = this._friendRequestsState.value;
    if (!currentState.inboundFriendRequests) return;

    const updatedInboundFriendRequests =
      currentState.inboundFriendRequests.filter(
        inboundFriendRequest => inboundFriendRequest._id !== friendRequest._id
      );

    this._friendRequestsState.next({
      ...currentState,
      inboundFriendRequests: updatedInboundFriendRequests,
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

  addOutboundFriendRequest(friendRequest: FriendRequest): void {
    const currentState = this._friendRequestsState.value;
    if (!currentState.outboundFriendRequests) return;

    const updatedOutboundFriendRequests = [
      ...currentState.outboundFriendRequests,
      friendRequest,
    ];
    this._friendRequestsState.next({
      ...currentState,
      outboundFriendRequests: updatedOutboundFriendRequests,
    });
  }

  removeOutboundFriendRequest(friendRequest: FriendRequest): void {
    const currentState = this._friendRequestsState.value;
    if (!currentState.outboundFriendRequests) return;

    const updatedOutboundFriendRequests =
      currentState.outboundFriendRequests.filter(
        outboundFriendRequest => outboundFriendRequest._id !== friendRequest._id
      );

    this._friendRequestsState.next({
      ...currentState,
      outboundFriendRequests: updatedOutboundFriendRequests,
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._friendRequestsState.value;
    this._friendRequestsState.next({ ...currentState, isLoading });
  }

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.setIsLoading(false);
    return of(null);
  };
}
