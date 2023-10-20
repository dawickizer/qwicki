import { Injectable } from '@angular/core';
import { Observable, of, tap, catchError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FriendApiService } from './friend.api.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { Friend } from './friend.model';
import { FriendStateService } from './friend.state.service';

@Injectable({
  providedIn: 'root',
})
export class FriendEffectService {
  private user: User;
  constructor(
    private friendApiService: FriendApiService,
    private friendStateService: FriendStateService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.subscribeToUserState();
  }

  private subscribeToUserState() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  deleteFriend(friend: Friend): Observable<Friend> {
    this.friendStateService.setIsLoading(true);
    return this.friendApiService.remove(this.user, friend._id).pipe(
      tap(deletedFriend => {
        this.friendStateService.removeFriend(deletedFriend);
        this.friendStateService.setIsLoading(false);
        //     const room: Colyseus.Room =
        //       this.colyseusService.onlineFriendsRooms.find(
        //         room => room.id === friend._id
        //       );
        //     if (room) {
        //       room.send('removeFriend', host);
        //       this.colyseusService.leaveRoom(room);
        //     } else {
        //       this.colyseusService.hostRoom.send('disconnectFriend', friend);
        //     }
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
