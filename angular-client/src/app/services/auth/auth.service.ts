import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  NavigationExtras,
} from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Credentials } from 'src/app/models/credentials/credentials';
import { User } from 'src/app/models/user/user';
import { ColyseusService } from '../colyseus/colyseus.service';
import { InactivityService } from '../inactivity/inactivity.service';
import { MatchMakingService } from '../match-making/match-making.service';
import { logout } from 'src/app/state/user/user.actions';
import { Store } from '@ngrx/store';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly API = `${environment.EXPRESS_SERVER}/auth`;

  private broadcast: BroadcastChannel = new BroadcastChannel('igima');

  constructor(
    private http: HttpClient,
    private router: Router,
    private colyseusService: ColyseusService,
    private matchMakingService: MatchMakingService,
    private inactivityService: InactivityService,
    private store: Store
  ) {
    // need to set authService like this to avoid circular dependancy
    this.inactivityService.setAuthService(this);
  }

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

  logout(extras?: NavigationExtras, makeBackendCall = true, broadcast = true) {
    if (makeBackendCall)
      this.http
        .put<any>(`${this.API}/logout`, null)
        .pipe(catchError(this.handleError))
        .subscribe();
    localStorage.removeItem('id_token');
    this.inactivityService.removeActiveEvents();
    this.inactivityService.stopTimers();
    if (broadcast) {
      this.colyseusService.leaveAllRooms();
      this.matchMakingService.leaveGameRoom();
      this.broadcast.postMessage('logout');
    }

    // maybe later flip this logic so the global state gets called to logout which then calls authService.logout()
    this.store.dispatch(logout());
    this.router.navigate(['auth/login'], extras);
  }

  isLoggedInFrontendCheck() {
    return this.currentUserJWT(); // keep in mind user can set a fake id_token to simulate login
  }

  isLoggedInBackendCheck(): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.API}/is-logged-in`)
      .pipe(
        tap(result => {
          if (result) {
            this.inactivityService.setBroadcastEvents();
            this.inactivityService.setActiveEvents();
            this.inactivityService.handleActiveEvent(); // fire off an active event in case user doesnt perform 'active' actions
          }
        })
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
    return throwError(() => error.error);
  }
}

@Injectable()
export class AuthGuardService {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (await this.authService.isLoggedInBackendCheck().toPromise()) {
      return true;
    } else {
      this.authService.logout({ queryParams: { return: state.url } }, false);
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
