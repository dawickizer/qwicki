import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  tap,
  switchMap,
  of,
  catchError,
} from 'rxjs';
import { UserState, initialState } from './user.state';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { Credentials } from 'src/app/models/credentials/credentials';
import { NavigationExtras, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  decodedJwtSelector,
  isLoadingSelector,
  isLoggedInSelector,
  jwtSelector,
  userFriendsSelector,
  userInboundFriendRequestsSelector,
  userOfflineFriendsSelector,
  userOnlineFriendsSelector,
  userOnlineSelector,
  userOutboundFriendRequestsSelector,
  userSelector,
} from './user.state.selectors';
import { InactivityService } from 'src/app/services/inactivity/inactivity.service';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';
import { DecodedJwt } from 'src/app/models/decoded-jwt/decoded-jwt';
import { Friend } from 'src/app/models/friend/friend';
import { SocialService } from 'src/app/services/social/social.service';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private _userState = new BehaviorSubject<UserState>(initialState);

  public userState$: Observable<UserState> = this._userState.asObservable();
  public jwt$ = jwtSelector(this.userState$);
  public decodedJwt$ = decodedJwtSelector(this.userState$);
  public isLoggedIn$ = isLoggedInSelector(this.userState$);
  public isLoading$ = isLoadingSelector(this.userState$);
  public user$ = userSelector(this.userState$);
  public userOnline$ = userOnlineSelector(this.user$);
  public userFriends$ = userFriendsSelector(this.user$);
  public userOnlineFriends$ = userOnlineFriendsSelector(this.user$);
  public userOfflineFriends$ = userOfflineFriendsSelector(this.user$);
  public userInboundFriendRequests$ = userInboundFriendRequestsSelector(
    this.user$
  );
  public userOutboundFriendRequests$ = userOutboundFriendRequestsSelector(
    this.user$
  );

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private socialService: SocialService,
    private inactivityService: InactivityService,
    private matchMakingService: MatchMakingService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.listenToInactivityEvents();
  }

  private listenToInactivityEvents(): void {
    this.inactivityService.userInactive.subscribe(() => {
      this.logout();
    });
  }

  login(credentials: Credentials, route: string): void {
    this.setIsLoading(true);
    this.authService
      .login(credentials)
      .pipe(
        tap((response: Credentials) => {
          this.setJwt(response.token);
        }),
        switchMap(() => {
          return this.authService.currentUser();
        }),
        tap((decodedJwt: DecodedJwt) => {
          this.setDecodedJwt(decodedJwt);
        }),
        switchMap(decodedJwt => {
          return this.userService.get(decodedJwt._id);
        }),
        tap((user: User) => {
          this.setUser(user);
          this.setIsLoggedIn(true);
          this.setIsLoading(false);
          this.router.navigate([route]);
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  signup(user: User, route: string): void {
    this.setIsLoading(true);
    this.authService
      .signup(user)
      .pipe(
        tap((response: Credentials) => {
          this.setJwt(response.token);
        }),
        switchMap(() => {
          return this.authService.currentUser();
        }),
        tap((decodedJwt: DecodedJwt) => {
          this.setDecodedJwt(decodedJwt);
        }),
        switchMap(decodedJwt => {
          return this.userService.get(decodedJwt._id);
        }),
        tap((user: User) => {
          this.setUser(user);
          this.setIsLoggedIn(true);
          this.setIsLoading(false);
          this.router.navigate([route]);
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  isLoggedIn(): Observable<boolean> {
    this.setIsLoading(true);
    return this.authService.isLoggedIn().pipe(
      tap(isLoggedIn => {
        this.setIsLoggedIn(isLoggedIn);
        if (isLoggedIn) {
          this.inactivityService.setActiveEvents();
          this.inactivityService.handleActiveEvent();
        }
        this.setIsLoading(false);
      }),
      catchError(error => {
        this.snackBar.open(error, 'Dismiss', { duration: 5000 });
        this.setIsLoggedIn(false);
        this.setIsLoading(false);
        return of(false);
      })
    );
  }

  logout(
    options: { extras?: NavigationExtras; makeBackendCall?: boolean } = {}
  ): void {
    this.setIsLoading(true);
    const { extras, makeBackendCall = true } = options;
    const logoutCall$ = makeBackendCall ? this.authService.logout() : of(null);

    logoutCall$
      .pipe(
        tap(() => {
          this.inactivityService.removeActiveEvents();
          this.inactivityService.stopTimers();
          this.matchMakingService.leaveGameRoom();
          this.setInitialState();
          this.router.navigate(['auth/login'], extras);
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

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

  sendFriendRequest(potentialFriend: string) {
    // this.socialService.sendFriendRequest(this.potentialFriend).subscribe({
    //   next: async host => {
    //     this.colyseusService.host = new User(host);
    //     const friendRequest: FriendRequest = this.findOutboundFriendRequest();
    //     const room: Colyseus.Room =
    //       await this.colyseusService.joinExistingRoomIfPresent(
    //         friendRequest.to
    //       );
    //     if (room) {
    //       room.send('sendFriendRequest', friendRequest);
    //       this.colyseusService.leaveRoom(room);
    //     }
    //     this.send.emit(friendRequest);
    //     this.openSnackBar(
    //       'Friend request sent to ' + this.potentialFriend,
    //       'Dismiss'
    //     );
    //     this.potentialFriend = '';
    //   },
    //   error: error => {
    //     this.openSnackBar(error, 'Dismiss');
    //     this.potentialFriend = '';
    //   },
    // });
  }

  // Everything below this line has no API effects and is purely state logic

  setInitialState() {
    this._userState.next(initialState);
  }

  setUser(user: User): void {
    const currentState = this._userState.value;
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

  setUserFriendOnline(friendId: string): void {
    const currentState = this._userState.value;
    if (!currentState.user) return;

    const friendIndex = currentState.user.friends.findIndex(
      friend => friend._id === friendId
    );

    if (friendIndex === -1) return; // if the friend with the given ID is not found

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.user.friends];

    // Update the online status of the specified friend
    updatedFriends[friendIndex] = {
      ...updatedFriends[friendIndex],
      online: true,
    };

    // Remove the friend from its current position and add to the start of the array
    const friendToMove = updatedFriends.splice(friendIndex, 1)[0];
    updatedFriends.unshift(friendToMove);

    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, friends: updatedFriends } as User),
    });
  }

  setUserFriendsOnline(friendIds: string[]): void {
    const currentState = this._userState.value;
    if (!currentState.user) return;

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.user.friends];

    friendIds.forEach(friendId => {
      const friendIndex = updatedFriends.findIndex(
        friend => friend._id === friendId
      );
      if (friendIndex === -1) return; // if the friend with the given ID is not found

      // Update the online status of the specified friend
      updatedFriends[friendIndex] = {
        ...updatedFriends[friendIndex],
        online: true,
      };

      // Remove the friend from its current position and add to the start of the array
      const friendToMove = updatedFriends.splice(friendIndex, 1)[0];
      updatedFriends.unshift(friendToMove);
    });

    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, friends: updatedFriends } as User),
    });
  }

  setUserFriendOffline(friendId: string): void {
    const currentState = this._userState.value;
    if (!currentState.user) return;

    const friendIndex = currentState.user.friends.findIndex(
      friend => friend._id === friendId
    );

    if (friendIndex === -1) return; // if the friend with the given ID is not found

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.user.friends];

    // Update the online status of the specified friend
    updatedFriends[friendIndex] = {
      ...updatedFriends[friendIndex],
      online: false,
    };

    // Remove the friend from its current position and push to the end of the array
    const friendToMove = updatedFriends.splice(friendIndex, 1)[0];
    updatedFriends.push(friendToMove);

    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, friends: updatedFriends } as User),
    });
  }

  setUserFriendsOffline(friendIds: string[]): void {
    const currentState = this._userState.value;
    if (!currentState.user) return;

    // Create a shallow copy of the friends array
    const updatedFriends = [...currentState.user.friends];

    friendIds.forEach(friendId => {
      const friendIndex = updatedFriends.findIndex(
        friend => friend._id === friendId
      );
      if (friendIndex === -1) return; // if the friend with the given ID is not found

      // Update the online status of the specified friend
      updatedFriends[friendIndex] = {
        ...updatedFriends[friendIndex],
        online: false,
      };

      // Remove the friend from its current position and push to the end of the array
      const friendToMove = updatedFriends.splice(friendIndex, 1)[0];
      updatedFriends.push(friendToMove);
    });

    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, friends: updatedFriends } as User),
    });
  }

  setUserFriends(friends: Friend[]) {
    const currentState = this._userState.value;
    if (!currentState.user) return;

    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, friends: [...friends] } as User),
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, isLoading });
  }

  setIsLoggedIn(isLoggedIn: boolean): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, isLoggedIn });
  }

  setJwt(jwt: string): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, jwt });
  }

  setDecodedJwt(decodedJwt: DecodedJwt): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, decodedJwt });
  }

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.setIsLoading(false);
    return of(null);
  };
}
