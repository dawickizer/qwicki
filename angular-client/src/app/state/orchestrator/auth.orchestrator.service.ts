import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Credentials } from 'src/app/state/auth/credentials.model';
import { User } from 'src/app/state/user/user.model';
import { AuthService } from '../auth/auth.service';
import { DecodedJwt } from '../auth/decoded-jwt.model';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';
import { SocialOrchestratorService } from './social.orchestrator.service';
import { InactivityService } from '../inactivity/inactivity.service';

@Injectable({
  providedIn: 'root',
})
export class AuthOrchestratorService {
  constructor(
    private authService: AuthService,
    private inactivityService: InactivityService,
    private matchMakingService: MatchMakingService,
    private socialOrchestratorService: SocialOrchestratorService,
    private router: Router
  ) {
    this.subscribeToInactivityState();
  }

  login(credentials: Credentials, returnPath: string): Observable<DecodedJwt> {
    const authObservable = this.authService.login(credentials);
    return this.authenticationFlow(authObservable, returnPath);
  }

  signup(user: User, returnPath: string): Observable<DecodedJwt> {
    const authObservable = this.authService.signup(user);
    return this.authenticationFlow(authObservable, returnPath);
  }

  logout(
    options: { extras?: NavigationExtras; makeBackendCall?: boolean } = {}
  ): Observable<any> {
    const { extras } = options;
    return this.authService.logout(options).pipe(
      tap(() => {
        this.inactivityService.stop();
        this.matchMakingService.leaveGameRoom(); // update to state logic
        this.socialOrchestratorService.setInitialState();
        this.router.navigate(['auth/login'], extras);
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      tap(isLoggedIn => {
        if (isLoggedIn) {
          this.inactivityService.start();
        }
      })
    );
  }

  private subscribeToInactivityState(): void {
    this.inactivityService.isTimedOut$.subscribe(isTimedOut => {
      if (isTimedOut) this.logout().subscribe();
    });
  }

  private authenticationFlow(
    authObservable: Observable<DecodedJwt>,
    returnPath: string
  ): Observable<DecodedJwt> {
    return authObservable.pipe(
      switchMap(decodedJwt =>
        this.socialOrchestratorService.connect(decodedJwt)
      ),
      tap(() => this.router.navigate([returnPath]))
    );
  }
}
