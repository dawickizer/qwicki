import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, retry } from 'rxjs/operators';
import { Observable, of, from, throwError } from 'rxjs';

import { User } from '../../models/user/user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly API = environment.EXPRESS_ENDPOINT;

  constructor(private http: HttpClient) { }

  // POST (add) a single User to the API/Database
  //
  // @param user: User - The User to be added
  // @return - An Observable<User> which can be subscribed to by the caller
  add(user: User): Observable<User> {
    return this.http.post<User>(`${this.API}/users`, user)
    .pipe(catchError(this.handleError));
  }

  // GET a single User from the API/Database
  //
  // @param user: User - The User to be got
  // @param _id: string - If user is null, then _id can be used to get the User by the caller
  // @return - An Observable<User> which can be subscribed to by the caller
  get(user?: User, _id?: string): Observable<User> {
    return this.http.get<User>(`${this.API}/users/${user ? user._id : _id}`)
    .pipe(catchError(this.handleError));
  }

  // PUT (update) a single User to the API/Database
  //
  // @param user: User - The User to be updated
  // @return - An Observable<User> which can be subscribed to by the caller
  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.API}/users/${user._id}`, user)
    .pipe(catchError(this.handleError));
  }

  // DELETE a single User to the API/Database
  //
  // @param user: User - The User to be deleted
  // @param _id: string - If user is null, then _id can be used to delete the User
  // @return - An Observable<any> which can be subscribed to by the caller and
  //           contains the result of deletion (or no deletion)
  delete(user?: User, _id?: string): Observable<any> {
    return this.http.delete(`${this.API}/users/${user ? user._id : _id}`)
    .pipe(catchError(this.handleError));
  }

  // GET all Users from the API/Database
  //
  // @return - An Observable<User[]> which can be subscribed to by the caller
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API}/users`)
    .pipe(catchError(this.handleError));
  }

  // Log HTTP errors/data to the console
  //
  // @param error: HttpErrorResponse - The HTTP error
  // @return - Return an observable with a user-facing error message.
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
    return throwError(
      'Something bad happened; please try again later.');
  }
}
