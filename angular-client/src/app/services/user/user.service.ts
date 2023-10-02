import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { User } from '../../models/user/user';
import { Message } from 'src/app/models/message/message';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly API = environment.EXPRESS_SERVER;
  private endpoint = '/users';

  constructor(private http: HttpClient) {}

  get(
    id: string,
    options?: { friends?: boolean; friendRequests?: boolean }
  ): Observable<User> {
    let params = new HttpParams();

    if (options) {
      if (options.friends !== undefined) {
        params = params.append('friends', options.friends.toString());
      }

      if (options.friendRequests !== undefined) {
        params = params.append(
          'friendRequests',
          options.friendRequests.toString()
        );
      }
    }

    return this.http
      .get<User>(`${this.API}${this.endpoint}/${id}`, { params })
      .pipe(catchError(this.handleError));
  }

  update(user: User): Observable<User> {
    return this.http
      .put<User>(`${this.API}${this.endpoint}/${user._id}`, user)
      .pipe(catchError(this.handleError));
  }

  delete(user: User): Observable<any> {
    return this.http
      .delete(`${this.API}${this.endpoint}/${user._id}`)
      .pipe(catchError(this.handleError));
  }

  createFriendRequest(user: User, username: string): Observable<FriendRequest> {
    return this.http
      .post<FriendRequest>(
        `${this.API}${this.endpoint}/${user._id}/friend-requests`,
        {
          username,
        }
      )
      .pipe(catchError(this.handleError));
  }

  deleteFriendRequest(user: User, friendRequestId: string): Observable<User> {
    return this.http
      .delete<User>(
        `${this.API}${this.endpoint}/${user._id}/friend-requests/${friendRequestId}`
      )
      .pipe(catchError(this.handleError));
  }

  addFriend(user: User, friendRequestId: string): Observable<User> {
    return this.http
      .post<User>(`${this.API}${this.endpoint}/${user._id}/friends`, {
        friendRequestId,
      })
      .pipe(catchError(this.handleError));
  }

  removeFriend(user: User, friendId: string): Observable<User> {
    return this.http
      .delete<User>(
        `${this.API}${this.endpoint}/${user._id}/friends/${friendId}`
      )
      .pipe(catchError(this.handleError));
  }

  createMessage(
    user: User,
    friendId: string,
    content: string
  ): Observable<Message> {
    return this.http
      .post<Message>(
        `${this.API}${this.endpoint}/${user._id}/messages/${friendId}`,
        { content }
      )
      .pipe(catchError(this.handleError));
  }

  getMessages(user: User, friendId: string): Observable<Message[]> {
    return this.http
      .get<Message[]>(
        `${this.API}${this.endpoint}/${user._id}/messages/${friendId}`
      )
      .pipe(catchError(this.handleError));
  }

  getUnviewedMessagesCount(
    user: User,
    friendId: string
  ): Observable<{ count: number }> {
    return this.http
      .get<{ count: number }>(
        `${this.API}${this.endpoint}/${user._id}/messages/${friendId}/unviewed`
      )
      .pipe(catchError(this.handleError));
  }

  markMessagesAsViewed(user: User, friendId: string): Observable<boolean> {
    return this.http
      .put<boolean>(
        `${this.API}${this.endpoint}/${user._id}/messages/${friendId}/viewed`,
        null
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(error.error);
  }
}
