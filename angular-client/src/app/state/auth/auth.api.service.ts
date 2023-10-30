import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Credentials } from 'src/app/state/auth/credentials.model';
import { User } from 'src/app/state/user/user.model';
import { DecodedJwt } from './decoded-jwt.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  readonly API = `${environment.EXPRESS_SERVER}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: Credentials): Observable<Credentials> {
    return this.http
      .post<Credentials>(`${this.API}/login`, credentials)
      .pipe(catchError(this.handleError));
  }

  signup(user: User): Observable<Credentials> {
    return this.http
      .post<Credentials>(`${this.API}/signup`, user)
      .pipe(catchError(this.handleError));
  }

  currentUser(): Observable<DecodedJwt> {
    return this.http
      .post<any>(`${this.API}/current-user`, null)
      .pipe(catchError(this.handleError));
  }

  logout(): Observable<any> {
    return this.http
      .post<any>(`${this.API}/logout`, null)
      .pipe(catchError(this.handleError));
  }

  isLoggedIn(): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.API}/is-logged-in`, null)
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
    return throwError(() => error.error);
  }
}
