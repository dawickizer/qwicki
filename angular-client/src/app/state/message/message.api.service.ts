import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { User } from '../user/user.model';
import { Message } from './message.model';
import { Friend } from '../friend/friend.model';

@Injectable({
  providedIn: 'root',
})
export class MessageApiService {
  readonly API = environment.EXPRESS_SERVER;
  private endpoint = '/users';

  constructor(private http: HttpClient) {}

  getAllBetween(user: User, friend: Friend): Observable<Message[]> {
    return this.http
      .get<Message[]>(
        `${this.API}${this.endpoint}/${user._id}/messages/${friend._id}`
      )
      .pipe(catchError(this.handleError));
  }

  send(user: User, friend: Friend, message: Message): Observable<Message> {
    return this.http
      .post<Message>(
        `${this.API}${this.endpoint}/${user._id}/messages/${friend._id}`,
        message
      )
      .pipe(catchError(this.handleError));
  }

  getUnviewedCountBetween(
    user: User,
    friend: Friend
  ): Observable<{ count: number }> {
    return this.http
      .get<{ count: number }>(
        `${this.API}${this.endpoint}/${user._id}/messages/${friend._id}/unviewed`
      )
      .pipe(catchError(this.handleError));
  }

  markAsViewed(
    user: User,
    friend: Friend,
    messages: Message[]
  ): Observable<Message[]> {
    return this.http
      .put<Message[]>(
        `${this.API}${this.endpoint}/${user._id}/messages/${friend._id}/viewed`,
        messages.map(message => message._id)
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
