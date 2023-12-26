import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { defaultIfEmpty, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';
import { Credentials } from 'src/app/state/auth/credentials.model';
import { User } from 'src/app/state/user/user.model';
import { AuthService } from './auth.service';
import { DecodedJwt } from './decoded-jwt.model';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';
import { InactivityService } from '../inactivity/inactivity.service';
import { Friend } from '../friend/friend.model';
import { Message } from '../message/message.model';
import { Room } from 'colyseus.js';
import { FriendService } from '../friend/friend.service';
import { FriendRequestService } from '../friend-request/friend-request.service';
import { UserService } from '../user/user.service';
import { InboxService } from '../inbox/inbox.service';
import { MessageService } from '../message/message.service';
import { InviteService } from '../invite/invite.service';
import { InboxOnMessageService } from '../inbox/inbox.on-message.service';
import { LobbyService } from '../lobby/lobby.service';
import { Lobby } from '../lobby/lobby.model';

@Injectable({
  providedIn: 'root',
})
export class AuthOrchestratorService {
  private user: User;
  private friends: Friend[];
  private unviewedMessages: Message[];
  private jwt: string;
  private decodedJwt: DecodedJwt;
  private connectedInboxes: Room<any>[];
  private lobby: Lobby;

  constructor(
    private authService: AuthService,
    private inactivityService: InactivityService,
    private matchMakingService: MatchMakingService,
    private friendRequestService: FriendRequestService,
    private friendService: FriendService,
    private userService: UserService,
    private inboxService: InboxService,
    private lobbyService: LobbyService,
    private messageService: MessageService,
    private inviteService: InviteService,
    private inboxOnMessageService: InboxOnMessageService,
    private router: Router
  ) {
    this.subscribeToState();
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
        this.setInitialState();
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

  private setInitialState() {
    this.inboxService
      .leaveInboxes(this.connectedInboxes, this.decodedJwt)
      .subscribe();
    this.lobbyService.leaveLobby(this.lobby?.room).subscribe();
    this.inboxService.setInitialState();
    this.lobbyService.setInitialState();
    this.userService.setInitialState();
    this.friendService.setInitialState();
    this.friendRequestService.setInitialState();
    this.messageService.setInitialState();
    this.inviteService.setInitialState();
  }

  private subscribeToState() {
    this.authService.jwt$.subscribe(jwt => (this.jwt = jwt));
    this.authService.decodedJwt$.subscribe(
      decodedJwt => (this.decodedJwt = decodedJwt)
    );
    this.userService.user$.subscribe(user => (this.user = user));
    this.friendService.friends$.subscribe(friends => (this.friends = friends));
    this.messageService.unviewedMessages$.subscribe(
      unviewedMessages => (this.unviewedMessages = unviewedMessages)
    );
    this.inboxService.connectedInboxes$.subscribe(
      connectedInboxes => (this.connectedInboxes = connectedInboxes)
    );
    this.lobbyService.lobby$.subscribe(lobby => (this.lobby = lobby));
    this.inactivityService.isTimedOut$.subscribe(isTimedOut => {
      if (isTimedOut) this.logout().subscribe();
    });
  }

  private setSocials(user: User) {
    this.friendService.setFriends(user.friends);
    this.friendRequestService.setInboundFriendRequests(
      user.inboundFriendRequests
    );
    this.friendRequestService.setOutboundFriendRequests(
      user.outboundFriendRequests
    );

    this.inviteService.setInboundInvites(user.inboundInvites);
    this.inviteService.setOutboundInvites(user.outboundInvites);
  }

  private authenticationFlow(
    authObservable: Observable<DecodedJwt>,
    returnPath: string
  ): Observable<DecodedJwt> {
    return authObservable.pipe(
      switchMap(decodedJwt => this.connect(decodedJwt)),
      tap(() => this.router.navigate([returnPath]))
    );
  }

  private connect(decodedJwt: DecodedJwt): Observable<any> {
    return this.userService
      .getUser(decodedJwt._id, {
        friends: true,
        friendRequests: true,
        invites: true,
      })
      .pipe(
        tap(user => this.setSocials(user)),
        switchMap(user => {
          if (user.friends.length > 0)
            return forkJoin(
              user.friends.map(friend =>
                this.messageService.getAllBetween(this.user, friend)
              )
            );
          else return of(null).pipe(defaultIfEmpty(null)); // Emit a default value when there are no friends.
        }),
        switchMap(() => this.createPersonalInbox()),
        switchMap(() => this.joinFriendsInboxesIfPresent()),
        tap(() =>
          this.friendService.sortFriendsByUnviewedMessages(
            this.unviewedMessages
          )
        )
      );
  }

  // TODO: might not need to set status and presence as that should be the lobby responsability
  private createPersonalInbox(): Observable<Room<any>> {
    return this.inboxService
      .createInbox(this.decodedJwt._id, {
        jwt: this.jwt,
        presence: 'Online',
        activity: null,
        queueType: null,
        gameType: null,
        gameMode: null,
        gameMap: null,
      })
      .pipe(
        tap(inbox => {
          this.userService.setPresence('Online');
          inbox = this.inboxOnMessageService.setPersonalInboxListeners(inbox);
          this.inboxService.setPersonalInbox(inbox);
        })
      );
  }

  private joinFriendsInboxesIfPresent(): Observable<Room<any>[]> {
    const friendIds = this.friends.map(friend => friend._id);

    return this.inboxService
      .joinExistingInboxesIfPresent(friendIds, {
        jwt: this.jwt,
        presence: this.user.presence,
        activity: this.user.activity,
        queueType: this.user.queueType,
        gameType: this.user.gameType,
        gameMode: this.user.gameMode,
        gameMap: this.user.gameMap,
      })
      .pipe(
        mergeMap(inboxes => {
          // If no inboxes are found, complete immediately with an empty array.
          if (inboxes.length === 0) {
            return of([]);
          }

          // Map each inbox to an Observable.
          const statusObservables = inboxes.map(inbox => {
            return new Observable<Room<any>>(subscriber => {
              // Immediately use the current state if it's available.
              const currentPresence = inbox.state.host.presence;
              if (currentPresence) {
                inbox =
                  this.inboxOnMessageService.setFriendInboxListeners(inbox);
                this.friendService.setFriendPresence(
                  inbox.state.host._id,
                  currentPresence
                );
                this.friendService.setFriendActivity(
                  inbox.state.host._id,
                  inbox.state.host.activity
                );

                this.friendService.setFriendQueueType(
                  inbox.state.host._id,
                  inbox.state.host.queueType
                );

                this.friendService.setFriendGameType(
                  inbox.state.host._id,
                  inbox.state.host.gameType
                );

                this.friendService.setFriendGameMode(
                  inbox.state.host._id,
                  inbox.state.host.gameMode
                );

                this.friendService.setFriendGameMap(
                  inbox.state.host._id,
                  inbox.state.host.gameMap
                );

                this.inboxService.updateConnectedInbox(inbox);
                subscriber.next(inbox);
                subscriber.complete();
              } else {
                // Set up the .once() listener if the state is not yet available.
                inbox.onStateChange.once(state => {
                  inbox =
                    this.inboxOnMessageService.setFriendInboxListeners(inbox);
                  this.friendService.setFriendPresence(
                    state.host._id,
                    state.host.presence
                  );

                  this.friendService.setFriendActivity(
                    state.host._id,
                    state.host.activity
                  );

                  this.friendService.setFriendQueueType(
                    state.host._id,
                    state.host.queueType
                  );

                  this.friendService.setFriendGameType(
                    state.host._id,
                    state.host.gameType
                  );

                  this.friendService.setFriendGameMode(
                    state.host._id,
                    state.host.gameMode
                  );

                  this.friendService.setFriendGameMap(
                    state.host._id,
                    state.host.gameMap
                  );

                  this.inboxService.updateConnectedInbox(inbox);
                  subscriber.next(inbox);
                  subscriber.complete();
                });
              }
            });
          });

          // Use forkJoin to wait for all Observables to complete.
          return forkJoin(statusObservables);
        })
      );
  }
}
