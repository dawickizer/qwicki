import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, take } from 'rxjs/operators';
import { Observable, firstValueFrom, throwError } from 'rxjs';
import { Credentials } from 'src/app/models/credentials/credentials';
import { User } from 'src/app/models/user/user';
import { InactivityService } from '../inactivity/inactivity.service';
import {
  checkIsLoggedIn,
  checkIsLoggedInFailure,
  checkIsLoggedInSuccess,
  createLogoutAction,
  logout,
} from 'src/app/state/user/user.actions';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from 'src/app/state/user/user.selectors';
import { Actions, ofType } from '@ngrx/effects';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly API = `${environment.EXPRESS_SERVER}/auth`;

  broadcast: BroadcastChannel = new BroadcastChannel('qwicki');

  constructor(
    private http: HttpClient,
    private inactivityService: InactivityService
  ) {}

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

  currentUser(): Observable<any> {
    return this.http
      .get<any>(`${this.API}/current-user`)
      .pipe(catchError(this.handleError));
  }

  currentUserJWT() {
    return localStorage.getItem('id_token');
  }

  logout(): Observable<any> {
    return this.http
      .put<any>(`${this.API}/logout`, null)
      .pipe(catchError(this.handleError));
  }

  isLoggedIn(): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.API}/is-logged-in`)
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

@Injectable()
export class AuthGuardService {
  constructor(
    private store: Store,
    private actions$: Actions
  ) {}

  // do NOT remove route param as it affects angular dep injection and will cause bugs with router logic
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    this.store.dispatch(checkIsLoggedIn());

    // Wait for the success or failure action to be dispatched
    await firstValueFrom(
      this.actions$.pipe(
        ofType(checkIsLoggedInSuccess, checkIsLoggedInFailure),
        take(1)
      )
    );

    // Now read the latest value from the store
    const isLoggedIn = await firstValueFrom(
      this.store.select(selectIsLoggedIn)
    );

    if (isLoggedIn) {
      return true;
    } else {
      this.store.dispatch(
        logout(
          createLogoutAction({
            extras: { queryParams: { return: state.url } },
            makeBackendCall: false,
          })
        )
      );
      return false;
    }
  }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let token: string = localStorage.getItem('id_token');
    if (token) {
      token = `Bearer ${token}`;
      const authReq = req.clone({ setHeaders: { Authorization: token } });
      return next.handle(authReq);
    } else return next.handle(req);
  }
}
