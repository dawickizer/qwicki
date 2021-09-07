import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, retry } from 'rxjs/operators';
import { Observable, of, from, throwError } from 'rxjs';

import { User } from '../../models/user/user';
import { Friend } from 'src/app/models/friend/friend';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly API = environment.EXPRESS_SERVER;

  constructor(private http: HttpClient) { }

  add(user: User): Observable<User> {
    return this.http.post<User>(`${this.API}/users`, user)
    .pipe(catchError(this.handleError));
  }

  get(id: string): Observable<User> {
    return this.http.get<User>(`${this.API}/users/${id}`)
    .pipe(catchError(this.handleError));
  }

  getFriendByUsername(username: string): Observable<Friend> {
    return this.http.get<Friend>(`${this.API}/users/friends/${username}`)
    .pipe(catchError(this.handleError));
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.API}/users/${user._id}`, user)
    .pipe(catchError(this.handleError));
  }

  delete(user: User): Observable<any> {
    return this.http.delete(`${this.API}/users/${user._id}`)
    .pipe(catchError(this.handleError));
  }

  deleteMany(users: User[]): Observable<any> {
    const params = new HttpParams().set('ids', users.join(','));
    return this.http.delete(`${this.API}/users/`, {params})
    .pipe(catchError(this.handleError));
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API}/users`)
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
