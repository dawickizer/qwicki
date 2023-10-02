import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, firstValueFrom, throwError } from 'rxjs';
import { Credentials } from 'src/app/models/credentials/credentials';
import { User } from 'src/app/models/user/user';
import { AuthStateService } from 'src/app/state/auth/auth.state.service';
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

  currentUser(): Observable<any> {
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
