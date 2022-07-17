import { Injectable, NgZone, OnInit } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, retry, tap } from 'rxjs/operators';
import { Observable, of, from, throwError, timer, Subscription } from 'rxjs';
import { Credentials } from 'src/app/models/credentials/credentials';
import { User } from 'src/app/models/user/user';
import { ColyseusService } from '../colyseus/colyseus.service';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly API = `${environment.EXPRESS_SERVER}/auth`;

  private inactivityThreshold: number = 5000; // 15 minutes
  private logoutThreshold: number = 10000 // this.inactivityThreshold + 1000 * 30; // inactivityThreshold + 30 seconds
  private inactiveTimer: Observable<number> = timer(this.inactivityThreshold);
  private logoutTimer: Observable<number> = timer(this.logoutThreshold);
  private inactiveTimerSubscription: Subscription = new Subscription();
  private logoutTimerSubscription: Subscription = new Subscription();
  private broadcast: BroadcastChannel = new BroadcastChannel('igima');
  private snackBarRef!: MatSnackBarRef<any>;
  //private currentUser: DecodedJwt | null | undefined;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private ngZone: NgZone,
    private snackBar: MatSnackBar,
    private colyseusService: ColyseusService) { }

  handleInactivityEvent = () => {
    this.broadcast.postMessage('active');
    this.startInactivityTimer();
  };

  broadcastEvents = (event: any) => {
    if (event.data === 'logout') {
      this.ngZone.run(() => this.logout(undefined, false, false));
    } else if (event.data === 'active') {
      this.ngZone.run(() => this.startInactivityTimer());
    }
  };

  setInactivityEvents() {
    window.addEventListener('keydown', this.handleInactivityEvent);
    window.addEventListener('wheel', this.handleInactivityEvent);
    window.addEventListener('mousemove', this.handleInactivityEvent);
    window.addEventListener('pointerdown', this.handleInactivityEvent);
  }

  removeInactivityEvents() {
    window.removeEventListener('keydown', this.handleInactivityEvent);
    window.removeEventListener('wheel', this.handleInactivityEvent);
    window.removeEventListener('mousemove', this.handleInactivityEvent);
    window.removeEventListener('pointerdown', this.handleInactivityEvent);
  }

  setBroadcastEvents() {
    this.broadcast.onmessage = this.broadcastEvents;
  }

  startInactivityTimer() {
    this.startLogoutTimer();
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
    this.inactiveTimerSubscription.unsubscribe();
    this.inactiveTimerSubscription = this.inactiveTimer.subscribe(() => {
      this.snackBarRef = this.snackBar.open('Your session is about to expire due to inactivity');
    });
  }

  stopInactivityTimer() {
    this.inactiveTimerSubscription.unsubscribe();
    this.logoutTimerSubscription.unsubscribe();
  }

  startLogoutTimer() {
    this.logoutTimerSubscription.unsubscribe();
    this.logoutTimerSubscription = this.logoutTimer.subscribe(() => {
      this.logout();
      this.snackBarRef = this.snackBar.open('You were logged out due to inactivity', '', { duration: 5000 });
    });
  }

  login(credentials: Credentials): Observable<Credentials> {
    return this.http.post<Credentials>(`${this.API}/login`, credentials)
    .pipe(tap(credentials => this.setSession(credentials.token)))
    .pipe(catchError(this.handleError));
  }

  signup(user: User): Observable<Credentials> {
    return this.http.post<Credentials>(`${this.API}/signup`, user)
    .pipe(tap(credentials => this.setSession(credentials.token)))
    .pipe(catchError(this.handleError));
  }

  currentUser(): Observable<any> {
    return this.http.get<any>(`${this.API}/current-user`)
    .pipe(catchError(this.handleError));
  }

  currentUserJWT() {
    return localStorage.getItem('id_token');
  }
  
  logout(extras?: NavigationExtras, makeBackendCall: boolean = true, broadcast: boolean = true) {
    if (broadcast) this.colyseusService.leaveAllRooms();
    if (makeBackendCall) this.http.put<any>(`${this.API}/logout`, null).pipe(catchError(this.handleError)).subscribe();
    localStorage.removeItem("id_token");
    this.removeInactivityEvents();
    this.stopInactivityTimer();
    if (broadcast) {
      this.broadcast.postMessage('logout');
    }
    this.router.navigate(['auth/login'], extras);

  }

  isLoggedInFrontendCheck() {
    return this.currentUserJWT(); // keep in mind user can set a fake id_token to simulate login
  }

  isLoggedInBackendCheck(): Observable<boolean> {
    return this.http.get<boolean>(`${this.API}/is-logged-in`)
    .pipe(tap(result => {
      if (result) {
        this.setBroadcastEvents();
        this.setInactivityEvents();

        // fire off the inactivity events in case user doesnt perform 'active' actions
        this.handleInactivityEvent();
      }
    }))
    .pipe(catchError(this.handleError));
  }

  private setSession(token: String) {
    localStorage.setItem('id_token', token as string);
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

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}
  
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (await this.authService.isLoggedInBackendCheck().toPromise()) {
      return true;
    } else {
      this.authService.logout({queryParams: {return: state.url}}, false);
      return false;
    }
  }
}
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let token: string = localStorage.getItem('id_token');
    if (token) {
      token = `Bearer ${token}`;
      const authReq = req.clone({ setHeaders: { Authorization: token } });
      return next.handle(authReq);
    } else return next.handle(req);
  }
}