import { Injectable } from '@angular/core';
import { Observable, tap, of, catchError } from 'rxjs';
import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStateService } from '../user/user.state.service';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { AuthStateService } from '../auth/auth.state.service';
import { FriendRequestApiService } from './friend-request.api.service';
import { FriendApiService } from '../friend/friend.api.service';
import { User } from '../user/user.model';
import { FriendService } from '../friend/friend.service';
import { FriendRequestStateService } from './friend-request.state.service';

@Injectable({
  providedIn: 'root',
})
export class FriendRequestEffectService {
  private user: User;
  private jwt: string;

  constructor(
    private friendRequestApiService: FriendRequestApiService,
    private friendApiService: FriendApiService,
    private friendRequestStateService: FriendRequestStateService,
    private friendService: FriendService,
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
  sendFriendRequest(potentialFriend: string): Observable<FriendRequest> {
    this.friendRequestStateService.setIsLoading(true);
    return this.friendRequestApiService.create(this.user, potentialFriend).pipe(
      tap(async friendRequest => {
        this.friendRequestStateService.addOutboundFriendRequest(friendRequest);
        this.friendRequestStateService.setIsLoading(false);
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
    );
  }

  acceptFriendRequest(friendRequest: FriendRequest): Observable<User> {
    this.friendRequestStateService.setIsLoading(true);
    return this.friendApiService.add(this.user, friendRequest._id).pipe(
      tap(async user => {
        this.friendRequestStateService.setInboundFriendRequests(
          user.inboundFriendRequests
        );
        this.friendService.setFriends(user.friends);
        const room = await this.colyseusService.joinExistingRoomIfPresent(
          friendRequest.from._id,
          this.jwt
        );
        if (room) {
          room.send('acceptFriendRequest', friendRequest);
          this.colyseusService.leaveRoom(room);
        }
        this.friendRequestStateService.setIsLoading(false);
        this.snackBar.open(
          `You and ${friendRequest.from.username} are now friends`,
          'Dismiss',
          { duration: 5000 }
        );
      }),
      catchError(this.handleError)
    );
  }

  revokeFriendRequest(friendRequest: FriendRequest): Observable<FriendRequest> {
    this.friendRequestStateService.setIsLoading(true);
    return this.friendRequestApiService
      .delete(this.user, friendRequest._id)
      .pipe(
        tap(async friendRequest => {
          this.friendRequestStateService.removeOutboundFriendRequest(
            friendRequest
          );
          this.friendRequestStateService.setIsLoading(false);
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
      );
  }

  rejectFriendRequest(friendRequest: FriendRequest): Observable<FriendRequest> {
    this.friendRequestStateService.setIsLoading(true);
    return this.friendRequestApiService
      .delete(this.user, friendRequest._id)
      .pipe(
        tap(async friendRequest => {
          this.friendRequestStateService.removeInboundFriendRequest(
            friendRequest
          );
          this.friendRequestStateService.setIsLoading(false);
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
      );
  }

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.friendRequestStateService.setIsLoading(false);
    return of(null);
  };
}
