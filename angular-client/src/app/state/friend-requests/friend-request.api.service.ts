import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { User } from '../../models/user/user';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';

@Injectable({
  providedIn: 'root',
})
export class FriendRequestApiService {
  readonly API = environment.EXPRESS_SERVER;
  private endpoint = '/users';

  constructor(private http: HttpClient) {}

  create(user: User, username: string): Observable<FriendRequest> {
    return this.http
      .post<FriendRequest>(
        `${this.API}${this.endpoint}/${user._id}/friend-requests`,
        {
          username,
        }
      )
      .pipe(catchError(this.handleError));
  }

  delete(user: User, friendRequestId: string): Observable<FriendRequest> {
    return this.http
      .delete<FriendRequest>(
        `${this.API}${this.endpoint}/${user._id}/friend-requests/${friendRequestId}`
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
