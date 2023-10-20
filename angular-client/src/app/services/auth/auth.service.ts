import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, switchMap } from 'rxjs/operators';
import { Observable, firstValueFrom, throwError } from 'rxjs';
import { Credentials } from 'src/app/models/credentials/credentials';
import { AuthStateService } from 'src/app/state/auth/auth.state.service';
import { DecodedJwt } from 'src/app/models/decoded-jwt/decoded-jwt';
import { FriendRequestsStateService } from 'src/app/state/friend-requests/friend-requests.state.service';
import { UserService } from 'src/app/state/user/user.service';
import { User } from 'src/app/state/user/user.model';
import { FriendService } from 'src/app/state/friend/friend.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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

@Injectable({
  providedIn: 'root',
})
export class AuthFlowService {
  constructor(
    private authStateService: AuthStateService,
    private userService: UserService,
    private friendService: FriendService,
    private friendRequestsStateService: FriendRequestsStateService,
    private router: Router
  ) {}

  login(credentials: Credentials, returnPath: string): void {
    const authObservable = this.authStateService.login(credentials);
    this.executeAuthenticationFlow(authObservable, returnPath);
  }

  signup(user: User, returnPath: string): void {
    const authObservable = this.authStateService.signup(user);
    this.executeAuthenticationFlow(authObservable, returnPath);
  }

  logout(): void {
    this.authStateService.logout();
  }

  private executeAuthenticationFlow(
    authObservable: Observable<DecodedJwt>,
    returnPath: string
  ): void {
    authObservable
      .pipe(
        switchMap(decodedJwt =>
          this.userService.getUser(decodedJwt._id, {
            friends: true,
            friendRequests: true,
          })
        )
      )
      .subscribe(user => {
        this.friendService.setFriends(user.friends);
        this.friendRequestsStateService.setInboundFriendRequests(
          user.inboundFriendRequests
        );
        this.friendRequestsStateService.setOutboundFriendRequests(
          user.outboundFriendRequests
        );
        this.router.navigate([returnPath]);
      });
  }
}

@Injectable()
export class AuthGuardService {
  constructor(private authStateService: AuthStateService) {}

  // do NOT remove route param as it affects angular dep injection and will cause bugs with router logic
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const isLoggedIn = await firstValueFrom(this.authStateService.isLoggedIn());

    if (isLoggedIn) {
      return true;
    } else {
      this.authStateService.logout({
        extras: { queryParams: { return: state.url } },
        makeBackendCall: false,
      });
      return false;
    }
  }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  jwt: string;

  constructor(private authStateService: AuthStateService) {
    this.authStateService.jwt$.subscribe(jwt => {
      this.jwt = jwt;
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.jwt) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${this.jwt}` },
      });
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
  }
}
