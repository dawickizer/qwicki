import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Credentials } from 'src/app/state/auth/credentials.model';
import { UserService } from 'src/app/state/user/user.service';
import { User } from 'src/app/state/user/user.model';
import { FriendService } from 'src/app/state/friend/friend.service';
import { FriendRequestService } from 'src/app/state/friend-request/friend-request.service';
import { AuthService } from './auth.service';
import { DecodedJwt } from './decoded-jwt.model';

@Injectable({
  providedIn: 'root',
})
export class AuthFlowService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private friendService: FriendService,
    private friendRequestService: FriendRequestService,
    private router: Router
  ) {}

  login(credentials: Credentials, returnPath: string): void {
    const authObservable = this.authService.login(credentials);
    this.executeAuthenticationFlow(authObservable, returnPath);
  }

  signup(user: User, returnPath: string): void {
    const authObservable = this.authService.signup(user);
    this.executeAuthenticationFlow(authObservable, returnPath);
  }

  logout(): void {
    this.authService.logout().subscribe();
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
        this.friendRequestService.setInboundFriendRequests(
          user.inboundFriendRequests
        );
        this.friendRequestService.setOutboundFriendRequests(
          user.outboundFriendRequests
        );
        this.router.navigate([returnPath]);
      });
  }
}
