import { Injectable } from '@angular/core';
import { Credentials } from 'src/app/state/auth/credentials.model';
import { User } from '../user/user.model';
import { AuthStateService } from './auth.state.service';
import { AuthEffectService } from './auth.effect.service';
import { Observable } from 'rxjs';
import { AuthState } from './auth.state';
import { NavigationExtras } from '@angular/router';
import { DecodedJwt } from './decoded-jwt.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  get authState$(): Observable<AuthState> {
    return this.authStateService.authState$;
  }

  get jwt$(): Observable<string> {
    return this.authStateService.jwt$;
  }

  get decodedJwt$(): Observable<DecodedJwt> {
    return this.authStateService.decodedJwt$;
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.authStateService.isLoggedIn$;
  }

  get isLoading$(): Observable<boolean> {
    return this.authStateService.isLoading$;
  }

  constructor(
    private authEffectService: AuthEffectService,
    private authStateService: AuthStateService
  ) {}

  login(credentials: Credentials): Observable<DecodedJwt> {
    return this.authEffectService.login(credentials);
  }

  signup(user: User): Observable<DecodedJwt> {
    return this.authEffectService.signup(user);
  }

  isLoggedIn(): Observable<boolean> {
    return this.authEffectService.isLoggedIn();
  }

  logout(options?: {
    extras?: NavigationExtras;
    makeBackendCall?: boolean;
  }): Observable<any> {
    return this.authEffectService.logout(options);
  }

  setInitialState(): void {
    this.authStateService.setInitialState();
  }

  setIsLoading(isLoading: boolean): void {
    this.authStateService.setIsLoading(isLoading);
  }

  setIsLoggedIn(isLoggedIn: boolean): void {
    this.authStateService.setIsLoggedIn(isLoggedIn);
  }

  setJwt(jwt: string): void {
    this.authStateService.setJwt(jwt);
  }

  setDecodedJwt(decodedJwt: DecodedJwt): void {
    this.authStateService.setDecodedJwt(decodedJwt);
  }
}
