import { Injectable } from '@angular/core';
import { Observable, tap, switchMap, map, of } from 'rxjs';
import { User } from '../user/user.model';
import { FriendService } from '../friend/friend.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { FriendRequestService } from '../friend-request/friend-request.service';
import { InboxService } from '../inbox/inbox.service';
import { Friend } from '../friend/friend.model';
import { FriendRequest } from '../friend-request/friend-requests.model';
import { Room } from 'colyseus.js';
import { MessageService } from '../message/message.service';
import { InviteService } from '../invite/invite.service';
import { DecodedJwt } from '../auth/decoded-jwt.model';
import { InboxOnMessageService } from '../inbox/inbox.on-message.service';

@Injectable({
  providedIn: 'root',
})
export class FriendOrchestratorService {
  private user: User;
  private jwt: string;
  private decodedJwt: DecodedJwt;
  private friendsInboxes: Room<any>[];
  private personalInbox: Room<any>;

  constructor(
    private friendRequestService: FriendRequestService,
    private friendService: FriendService,
    private userService: UserService,
    private authService: AuthService,
    private inboxService: InboxService,
    private messageService: MessageService,
    private inviteService: InviteService,
    private inboxOnMessageService: InboxOnMessageService
  ) {
    this.subscribeToState();
  }

  private subscribeToState() {
    this.authService.jwt$.subscribe(jwt => (this.jwt = jwt));
    this.authService.decodedJwt$.subscribe(
      decodedJwt => (this.decodedJwt = decodedJwt)
    );
    this.userService.user$.subscribe(user => (this.user = user));
    this.inboxService.friendsInboxes$.subscribe(
      friendsInboxes => (this.friendsInboxes = friendsInboxes)
    );
    this.inboxService.personalInbox$.subscribe(
      personalInbox => (this.personalInbox = personalInbox)
    );
  }

  setInitialState() {
    this.friendService.setInitialState();
  }

  deleteFriend(friend: Friend): Observable<Friend> {
    return this.friendService.deleteFriend(this.user, friend).pipe(
      switchMap(deletedFriend => {
        this.messageService.removeMessagesFromFriend(friend);
        this.inviteService.removeInvitesFromFriend(friend);
        const friendsInbox = this.friendsInboxes.find(
          friendsInbox => friendsInbox.id === deletedFriend._id
        );
        if (friendsInbox) {
          friendsInbox.send('removeFriend', this.user);
          return this.inboxService
            .leaveInbox(friendsInbox, this.decodedJwt)
            .pipe(map(() => deletedFriend));
        } else {
          this.personalInbox.send('disconnectFriend', friend);
          return of(deletedFriend);
        }
      })
    );
  }

  addNewFriend(friendRequest: FriendRequest): Observable<User> {
    return this.friendService.addNewFriend(this.user, friendRequest).pipe(
      tap(user => {
        this.friendRequestService.setInboundFriendRequests(
          user.inboundFriendRequests
        );
      }),
      switchMap(user =>
        this.inboxService
          .joinExistingInboxIfPresent(friendRequest.from._id, {
            jwt: this.jwt,
            status: this.user.status,
          })
          .pipe(
            tap(inbox => {
              // keep in mind that this logic is async and the tap will proceed while this is lagging behind
              // for now that is fine since nothing after this really depends on the logic inside of onStateChange()
              if (inbox) {
                inbox.onStateChange.once(state => {
                  inbox.send('acceptFriendRequest', friendRequest);
                  inbox =
                    this.inboxOnMessageService.setFriendInboxListeners(inbox);
                  this.friendService.updateFriendStatus(
                    friendRequest.from._id,
                    state.host.status
                  );
                  this.inboxService.updateConnectedInbox(inbox);
                });
              } else {
                this.friendService.updateFriendStatus(friendRequest.from._id, {
                  presence: 'Offline',
                  activity: 'In Lobby',
                });
              }
            }),
            map(() => user)
          )
      ),
      switchMap(user =>
        this.messageService
          .getAllBetween(this.user, friendRequest.from)
          .pipe(map(() => user))
      )
    );
  }
}
