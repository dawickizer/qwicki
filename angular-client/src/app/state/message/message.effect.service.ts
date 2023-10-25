import { Injectable } from '@angular/core';
import { Observable, of, tap, catchError, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageApiService } from './message.api.service';
import { Message } from './message.model';
import { MessageStateService } from './message.state.service';
import { Friend } from '../friend/friend.model';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root',
})
export class MessageEffectService {
  constructor(
    private messageApiService: MessageApiService,
    private messageStateService: MessageStateService,
    private snackBar: MatSnackBar
  ) {}

  getAllBetween(
    user: User,
    friend: Friend
  ): Observable<Map<string, Message[]>> {
    return this.messageApiService.getAllBetween(user, friend).pipe(
      map(messages => this.messageStateService.groupMessagesByDate(messages)),
      tap(messages =>
        this.messageStateService.setFriendMessages(friend, messages)
      ),
      catchError(this.handleError)
    );
  }

  send(user: User, friend: Friend, message: Message): Observable<Message> {
    return this.messageApiService.send(user, friend, message).pipe(
      tap(message => {
        this.messageStateService.addMessageToFriend(friend, message);
      }),
      catchError(this.handleError)
    );
  }

  getUnviewedCountBetween(
    user: User,
    friend: Friend
  ): Observable<{ count: number }> {
    return this.messageApiService.getUnviewedCountBetween(user, friend).pipe(
      tap(count => {
        // state modifying logic
      }),
      catchError(this.handleError)
    );
  }

  markAsViewed(user: User, friend: Friend): Observable<boolean> {
    return this.messageApiService.markAsViewed(user, friend).pipe(
      tap(result => {
        // state modifying logic
      }),
      catchError(this.handleError)
    );
  }

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.messageStateService.setIsLoading(false);
    return of(null);
  };
}
