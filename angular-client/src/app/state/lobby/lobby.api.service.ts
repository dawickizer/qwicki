import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { LobbyMessage } from './lobby-message.model';

@Injectable({
  providedIn: 'root',
})
export class LobbyApiService {
  readonly API = environment.EXPRESS_SERVER;
  private endpoint = '/lobbies';

  constructor(private http: HttpClient) {}

  sendMessage(message: LobbyMessage): Observable<LobbyMessage> {
    return this.http
      .post<LobbyMessage>(
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
