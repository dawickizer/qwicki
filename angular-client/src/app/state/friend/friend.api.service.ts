import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { User } from '../user/user.model';
import { Friend } from './friend.model';

@Injectable({
  providedIn: 'root',
})
export class FriendApiService {
  readonly API = environment.EXPRESS_SERVER;
  private endpoint = '/users';

  constructor(private http: HttpClient) {}

  add(user: User, friendRequestId: string): Observable<User> {
    return this.http
      .post<User>(`${this.API}${this.endpoint}/${user._id}/friends`, {
        friendRequestId,
      })
      .pipe(catchError(this.handleError));
  }

  remove(user: User, friendId: string): Observable<Friend> {
    return this.http
      .delete<Friend>(
        `${this.API}${this.endpoint}/${user._id}/friends/${friendId}`
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
