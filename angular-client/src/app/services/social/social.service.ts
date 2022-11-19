import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, retry } from 'rxjs/operators';
import { Observable, of, from, throwError } from 'rxjs';

import { User } from '../../models/user/user';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  readonly API = environment.EXPRESS_SERVER;

  constructor(private http: HttpClient) { }

  sendFriendRequest(username: string): Observable<User> {
    return this.http.post<User>(`${this.API}/social/friend-request`, {username})
    .pipe(catchError(this.handleError));
  }

  acceptFriendRequest(friendRequest: FriendRequest): Observable<User> {
    return this.http.post<User>(`${this.API}/social/accept-friend-request/${friendRequest.from._id}`, {friendRequestId: friendRequest._id})
    .pipe(catchError(this.handleError));
  }

  rejectFriendRequest(friendRequest: FriendRequest): Observable<User> {
    return this.http.post<User>(`${this.API}/social/reject-friend-request/${friendRequest.from._id}`, {friendRequestId: friendRequest._id})
    .pipe(catchError(this.handleError));
  }

  revokeFriendRequest(friendRequest: FriendRequest): Observable<User> {
    return this.http.post<User>(`${this.API}/social/revoke-friend-request/${friendRequest.to._id}`, {friendRequestId: friendRequest._id})
    .pipe(catchError(this.handleError));
  }

  removeFriend(friend: User): Observable<User> {
    return this.http.delete<User>(`${this.API}/social/remove-friend/${friend._id}`)
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
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(error.error);
  }
}
