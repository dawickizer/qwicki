import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Credentials } from 'src/app/state/auth/credentials.model';
import { UserService } from 'src/app/state/user/user.service';
import { User } from 'src/app/state/user/user.model';
import { FriendService } from 'src/app/state/friend/friend.service';
import { FriendRequestService } from 'src/app/state/friend-request/friend-request.service';
import { AuthService } from '../auth/auth.service';
import { DecodedJwt } from '../auth/decoded-jwt.model';
import { InactivityService } from 'src/app/services/inactivity/inactivity.service';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';
import { InboxService } from '../inbox/inbox.service';
import { Room } from 'colyseus.js';

@Injectable({
  providedIn: 'root',
})
export class AuthOrchestratorService {
  private connectedInboxes: Room<any>[];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private inboxService: InboxService,
    private inactivityService: InactivityService,
    private matchMakingService: MatchMakingService,
    private friendService: FriendService,
    private friendRequestService: FriendRequestService,
    private router: Router
  ) {
    this.listenToInactivityEvents();
    this.subscribeToInboxState();
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
        this.inactivityService.removeActiveEvents(); // update to state logic
        this.inactivityService.stopTimers(); // update to state logic
        this.matchMakingService.leaveGameRoom(); // update to state logic
        this.inboxService.leaveInboxes(this.connectedInboxes).subscribe();
        this.inboxService.setInitialState();
        this.userService.setInitialState();
        this.friendService.setInitialState();
        this.friendRequestService.setInitialState();
        this.router.navigate(['auth/login'], extras);
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      tap(isLoggedIn => {
        if (isLoggedIn) {
          this.inactivityService.setActiveEvents();
          this.inactivityService.handleActiveEvent();
        }
      })
    );
  }

  private listenToInactivityEvents(): void {
    this.inactivityService.userInactive.subscribe(() => {
      this.logout().subscribe();
    });
  }

  private subscribeToInboxState(): void {
    this.inboxService.connectedInboxes$.subscribe(connectedInboxes => {
      this.connectedInboxes = connectedInboxes;
    });
  }

  private authenticationFlow(
    authObservable: Observable<DecodedJwt>,
    returnPath: string
  ): Observable<DecodedJwt> {
    return authObservable.pipe(
      switchMap(decodedJwt =>
        this.userService.getUser(decodedJwt._id, {
          friends: true,
          friendRequests: true,
        })
      ),
      tap(user => {
        this.friendService.setFriends(user.friends);
        this.friendRequestService.setInboundFriendRequests(
          user.inboundFriendRequests
        );
        this.friendRequestService.setOutboundFriendRequests(
          user.outboundFriendRequests
        );
        this.router.navigate([returnPath]);
      })
    );
  }
}
