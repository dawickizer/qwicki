import { Injectable } from '@angular/core';
import { Observable, of, tap, catchError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FriendApiService } from './friend.api.service';
import { User } from '../user/user.model';
import { Friend } from './friend.model';
import { FriendStateService } from './friend.state.service';
import { FriendRequest } from '../friend-request/friend-requests.model';

@Injectable({
  providedIn: 'root',
})
export class FriendEffectService {
  constructor(
    private friendApiService: FriendApiService,
    private friendStateService: FriendStateService,
    private snackBar: MatSnackBar
  ) {}

  addNewFriend(user: User, friendRequest: FriendRequest): Observable<User> {
    this.friendStateService.setIsLoading(true);
    return this.friendApiService.add(user, friendRequest._id).pipe(
      tap(() => {
        this.friendStateService.addFriend(friendRequest.from);
        this.friendStateService.setIsLoading(false);
        this.snackBar.open(
          `You and ${friendRequest.from.username} are now friends`,
          'Dismiss',
          { duration: 5000 }
        );
      }),
      catchError(this.handleError)
    );
  }

  deleteFriend(user: User, friend: Friend): Observable<Friend> {
    this.friendStateService.setIsLoading(true);
    return this.friendApiService.remove(user, friend._id).pipe(
      tap(deletedFriend => {
        this.friendStateService.removeFriend(deletedFriend);
        this.friendStateService.setIsLoading(false);
        this.snackBar.open(
          `You and ${deletedFriend.username} are no longer friends`,
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
    this.friendStateService.setIsLoading(false);
    return of(null);
  };
}
