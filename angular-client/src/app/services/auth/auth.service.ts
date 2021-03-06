import { Injectable, OnInit } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, retry, tap } from 'rxjs/operators';
import { Observable, of, from, throwError } from 'rxjs';
import { Credentials } from 'src/app/models/credentials/credentials';
import { User } from 'src/app/models/user/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly API = environment.EXPRESS_ENDPOINT;

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: Credentials): Observable<Credentials> {
    return this.http.post<Credentials>(`${this.API}/auth/login`, credentials)
    .pipe(tap(credentials => this.setSession(credentials.token)))
    .pipe(catchError(this.handleError));
  }

  signup(user: User): Observable<Credentials> {
    return this.http.post<Credentials>(`${this.API}/auth/signup`, user)
    .pipe(tap(credentials => this.setSession(credentials.token)))
    .pipe(catchError(this.handleError));
  }

  currentUser(): Observable<any> {
    return this.http.get<any>(`${this.API}/auth/current-user`)
    .pipe(catchError(this.handleError));
  }
  
  logout(extras?: NavigationExtras) {
    localStorage.removeItem("id_token");
    this.router.navigate(['auth/login'], extras);
  }

  isLoggedInFrontendCheck() {
    return localStorage.getItem('id_token'); // keep in mind user can set a fake id_token to simulate login
  }

  isLoggedInBackendCheck(): Observable<boolean> {
    return this.http.get<boolean>(`${this.API}/auth/is-logged-in`)
    .pipe(catchError(this.handleError));
  }

  private setSession(token: String) {
    // const expiresAt = moment().add(authResult.expiresIn,'second');
    localStorage.setItem('id_token', token as string);
    // localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
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
      this.authService.logout({queryParams: {return: state.url}});
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
