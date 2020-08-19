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

  API = environment.EXPRESS_ENDPOINT;

  constructor(private http: HttpClient) { }

  // Add one person to the API
  addPerson(name, age): Observable<any> {
    return this.http.post(`${this.API}/users`, {name, age});
  }

  // Get all users from the API
  getAllPeople(): Observable<any> {
    return this.http.get(`${this.API}/users`);
  }

  add(user: User): Observable<User> {
    return this.http.post<User>(`${this.API}/users`, user)
      .pipe(catchError(this.handleError('add', user)));
  }

  get(user: User): Observable<User> {
    return this.http.get<User>(`${this.API}/users/${user.id}`)
    .pipe(catchError(this.handleError));
  }

  update(): Observable<any> {
    return null;
  }

  delete(): Observable<any> {
    return null;
  }

  getAll(): Observable<any> {
    return null;
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
    return throwError(
      'Something bad happened; please try again later.');
  }
}
