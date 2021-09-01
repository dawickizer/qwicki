import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, retry } from 'rxjs/operators';
import { Observable, of, from, throwError } from 'rxjs';

import { User } from '../../models/user/user';
import { Friend } from 'src/app/models/friend/friend';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  readonly API = environment.EXPRESS_ENDPOINT;

  constructor(private http: HttpClient) { }

  sendFriendRequest(friendRequest: FriendRequest): Observable<any> {
    return this.http.post<FriendRequest>(`${this.API}/social/friend-request`, friendRequest)
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
