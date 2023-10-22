import { Injectable } from '@angular/core';
import { Observable, tap, switchMap, map, of } from 'rxjs';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { User } from '../user/user.model';
import { FriendService } from '../friend/friend.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { FriendRequestService } from '../friend-request/friend-request.service';
import { InboxService } from '../inbox/inbox.service';
import { Friend } from '../friend/friend.model';
import { FriendRequest } from '../friend-request/friend-requests.model';
import { Room } from 'colyseus.js';

@Injectable({
  providedIn: 'root',
})
export class SocialOrchestratorService {
  private user: User;
  private jwt: string;
  private friendsInboxes: Room<any>[];
  private personalInbox: Room<any>;

  constructor(
    private friendRequestService: FriendRequestService,
    private friendService: FriendService,
    private userService: UserService,
    private authService: AuthService,
    private inboxService: InboxService,
    private colyseusService: ColyseusService
  ) {
    this.subscribeToAuthState();
    this.subscribeToUserState();
    this.subscribeToInboxState();
  }

  private subscribeToUserState() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  private subscribeToAuthState() {
    this.authService.jwt$.subscribe(jwt => {
      this.jwt = jwt;
    });
  }

  private subscribeToInboxState() {
    this.inboxService.friendsInboxes$.subscribe(friendsInboxes => {
      this.friendsInboxes = friendsInboxes;
    });

    this.inboxService.personalInbox$.subscribe(personalInbox => {
      this.personalInbox = personalInbox;
    });
  }

  deleteFriend(friend: Friend): Observable<Friend> {
    return this.friendService.deleteFriend(this.user, friend).pipe(
      switchMap(deletedFriend => {
        const friendsInbox = this.friendsInboxes.find(
          friendsInbox => friendsInbox.id === deletedFriend._id
        );
        if (friendsInbox) {
          friendsInbox.send('removeFriend', this.user);
          return this.inboxService
            .leaveInbox(friendsInbox)
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
      tap(async user => {
        this.friendRequestService.setInboundFriendRequests(
          user.inboundFriendRequests
        );
      }),
      switchMap(user =>
        this.inboxService
          .joinExistingInboxIfPresent(friendRequest.from._id)
          .pipe(
            tap(inbox => {
              if (inbox) {
                inbox.send('acceptFriendRequest', friendRequest);
              }
            }),
            map(() => user)
          )
      )
    );
  }

  sendFriendRequest(potentialFriend: string): Observable<FriendRequest> {
    return this.friendRequestService
      .sendFriendRequest(this.user, potentialFriend)
      .pipe(
        tap(async friendRequest => {
          const inbox = await this.colyseusService.joinExistingRoomIfPresent(
            friendRequest.to._id,
            this.jwt
          );
          if (inbox) {
            inbox.send('sendFriendRequest', friendRequest);
            this.colyseusService.leaveRoom(inbox);
          }
        })
      );
  }

  revokeFriendRequest(friendRequest: FriendRequest): Observable<FriendRequest> {
    return this.friendRequestService
      .revokeFriendRequest(this.user, friendRequest)
      .pipe(
        tap(async friendRequest => {
          const inbox = await this.colyseusService.joinExistingRoomIfPresent(
            friendRequest.to._id,
            this.jwt
          );
          if (inbox) {
            inbox.send('revokeFriendRequest', friendRequest);
            this.colyseusService.leaveRoom(inbox);
          }
        })
      );
  }

  rejectFriendRequest(friendRequest: FriendRequest): Observable<FriendRequest> {
    return this.friendRequestService
      .rejectFriendRequest(this.user, friendRequest)
      .pipe(
        tap(async friendRequest => {
          const inbox = await this.colyseusService.joinExistingRoomIfPresent(
            friendRequest.from._id,
            this.jwt
          );
          if (inbox) {
            inbox.send('rejectFriendRequest', friendRequest);
            this.colyseusService.leaveRoom(inbox);
          }
        })
      );
  }
}
