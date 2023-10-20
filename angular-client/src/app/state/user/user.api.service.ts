import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
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
