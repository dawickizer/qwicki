import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, of, catchError } from 'rxjs';
import { UserState, initialState } from './user.state';
import { User } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  isLoadingSelector,
  userOnlineSelector,
  userSelector,
} from './user.state.selectors';
import { Friend } from 'src/app/models/friend/friend';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';
import { FriendsStateService } from '../friends/friends.state.service';
import { FriendRequestsStateService } from '../friend-requests/friend-requests.state.service';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private _userState = new BehaviorSubject<UserState>(initialState);

  public userState$: Observable<UserState> = this._userState.asObservable();
  public isLoading$ = isLoadingSelector(this.userState$);
  public user$ = userSelector(this.userState$);
  public userOnline$ = userOnlineSelector(this.user$);
  public userFriends$ = this.friendsStateService.friends$;
  public userOnlineFriends$ = this.friendsStateService.onlineFriends$;
  public userOfflineFriends$ = this.friendsStateService.offlineFriends$;
  public userFriendsIsLoading$ = this.friendsStateService.isLoading$;
  public userInboundFriendRequests$ =
    this.friendRequestsStateService.inboundFriendRequests$;
  public userOutboundFriendRequests$ =
    this.friendRequestsStateService.outboundFriendRequests$;
  public friendRequestsIsLoading = this.friendRequestsStateService.isLoading$;

  constructor(
    private friendsStateService: FriendsStateService,
    private friendRequestsStateService: FriendRequestsStateService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  // Side effects
  updateUser(user: User): void {
    this.setIsLoading(true);
    this.userService
      .update(user)
      .pipe(
        tap(user => {
          this.setUser(user);
          this.setIsLoading(false);
          this.snackBar.open(
            'Your information has been successfully updated!',
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  deleteUser(user: User): void {
    this.setIsLoading(true);
    this.userService
      .delete(user)
      .pipe(
        tap(() => {
          this.setUser(null);
          this.setIsLoading(false);
          this.snackBar.open(
            'Your account has been successfully deleted!',
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  sendFriendRequest(potentialFriend: string): void {
    const user = this._userState.value.user;
    this.friendRequestsStateService.sendFriendRequest(user, potentialFriend);
  }

  acceptFriendRequest(friendRequest: FriendRequest): void {
    const user = this._userState.value.user;
    this.friendRequestsStateService.acceptFriendRequest(user, friendRequest);
  }

  revokeFriendRequest(friendRequest: FriendRequest): void {
    const user = this._userState.value.user;
    this.friendRequestsStateService.revokeFriendRequest(user, friendRequest);
  }

  rejectFriendRequest(friendRequest: FriendRequest): void {
    const user = this._userState.value.user;
    this.friendRequestsStateService.rejectFriendRequest(user, friendRequest);
  }

  removeFriend(friend: Friend): void {
    const user = this._userState.value.user;
    this.friendsStateService.removeFriend(user, friend);
  }

  // Pure state

  setInitialState() {
    this._userState.next(initialState);
  }

  setUser(user: User): void {
    const currentState = this._userState.value;
    this.friendsStateService.setFriends(user.friends);
    this.friendRequestsStateService.setInboundFriendRequests(
      user.inboundFriendRequests
    );
    this.friendRequestsStateService.setOutboundFriendRequests(
      user.outboundFriendRequests
    );
    this._userState.next({ ...currentState, user: new User(user) });
  }

  setUserOnline(online: boolean): void {
    const currentState = this._userState.value;
    if (!currentState.user) return;
    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, online } as User),
    });
  }

  setUserFriends(friends: Friend[]) {
    this.friendsStateService.setFriends(friends);
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, isLoading });
  }

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.setIsLoading(false);
    return of(null);
  };
}
