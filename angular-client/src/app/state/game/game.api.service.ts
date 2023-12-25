import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { GameMessage } from './game-message.model';

@Injectable({
  providedIn: 'root',
})
export class GameApiService {
  readonly API = environment.EXPRESS_SERVER;
  private endpoint = '/games';

  constructor(private http: HttpClient) {}

  sendMessage(message: GameMessage): Observable<GameMessage> {
    return this.http
      .post<GameMessage>(
        `${this.API}${this.endpoint}/${message.to}/messages`,
        message
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
