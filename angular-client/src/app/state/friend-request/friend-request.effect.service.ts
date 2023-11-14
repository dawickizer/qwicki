import { Injectable } from '@angular/core';
import { Observable, tap, of, catchError } from 'rxjs';
import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FriendRequestApiService } from './friend-request.api.service';
import { User } from '../user/user.model';
import { FriendRequestStateService } from './friend-request.state.service';

@Injectable({
  providedIn: 'root',
})
export class FriendRequestEffectService {
  private receivedFriendRequestAudio = new Audio('assets/notifications/sounds/mixkit-long-pop-2358.wav');

  constructor(
    private friendRequestApiService: FriendRequestApiService,
    private friendRequestStateService: FriendRequestStateService,
    private snackBar: MatSnackBar
  ) {}

  sendFriendRequest(
    user: User,
    potentialFriend: string
  ): Observable<FriendRequest> {
    this.friendRequestStateService.setIsLoading(true);
    return this.friendRequestApiService.create(user, potentialFriend).pipe(
      tap(friendRequest => {
        this.friendRequestStateService.addOutboundFriendRequest(friendRequest);
        this.friendRequestStateService.setIsLoading(false);
        this.snackBar.open(
          `Friend Request sent to ${potentialFriend}`,
          'Dismiss',
          { duration: 5000 }
        );
      }),
      catchError(this.handleError)
    );
  }

  revokeFriendRequest(
    user: User,
    friendRequest: FriendRequest
  ): Observable<FriendRequest> {
    this.friendRequestStateService.setIsLoading(true);
    return this.friendRequestApiService.delete(user, friendRequest._id).pipe(
      tap(async friendRequest => {
        this.friendRequestStateService.removeOutboundFriendRequest(
          friendRequest
        );
        this.friendRequestStateService.setIsLoading(false);
        this.snackBar.open(
          `Friend Request unsent to ${friendRequest.to.username}`,
          'Dismiss',
          { duration: 5000 }
        );
      }),
      catchError(this.handleError)
    );
  }

  rejectFriendRequest(
    user: User,
    friendRequest: FriendRequest
  ): Observable<FriendRequest> {
    this.friendRequestStateService.setIsLoading(true);
    return this.friendRequestApiService.delete(user, friendRequest._id).pipe(
      tap(async friendRequest => {
        this.friendRequestStateService.removeInboundFriendRequest(
          friendRequest
        );
        this.friendRequestStateService.setIsLoading(false);
        this.snackBar.open(
          `Friend Request from ${friendRequest.from.username} rejected`,
          'Dismiss',
          { duration: 5000 }
        );
      }),
      catchError(this.handleError)
    );
  }

  receiveFriendRequest(
    friendRequest: FriendRequest
  ): Observable<FriendRequest> {
    this.receivedFriendRequestAudio.play();
    this.friendRequestStateService.setIsLoading(true);
    this.friendRequestStateService.addInboundFriendRequest(friendRequest);
    this.friendRequestStateService.setIsLoading(false);
    this.snackBar.open(
      `${friendRequest.from.username} sent you a friend request!`,
      'Dismiss',
      { duration: 5000 }
    );

    return of(friendRequest);
  }

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.friendRequestStateService.setIsLoading(false);
    return of(null);
  };
}
