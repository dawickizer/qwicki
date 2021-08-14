import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, retry } from 'rxjs/operators';
import { Observable, of, from, throwError } from 'rxjs';
import { Login } from 'src/app/models/login/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  readonly API = environment.EXPRESS_ENDPOINT;

  constructor(private http: HttpClient) { }

  login(loginCredentials: Login): Observable<Login> {
    return this.http.post<Login>(`${this.API}/login`, loginCredentials)
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
    return throwError(
      'Something bad happened; please try again later.');
  }
}
