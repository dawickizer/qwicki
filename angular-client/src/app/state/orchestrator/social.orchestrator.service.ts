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
import { DecodedJwt } from '../auth/decoded-jwt.model';

@Injectable({
  providedIn: 'root',
})
export class SocialOrchestratorService {
  private user: User;
  private friends: Friend[];
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
    private colyseusService: ColyseusService
  ) {
    this.subscribeToAuthState();
    this.subscribeToUserState();
    this.subscribeToFriendState();
    this.subscribeToInboxState();
  }

  private subscribeToAuthState() {
    this.authService.jwt$.subscribe(jwt => {
      this.jwt = jwt;
    });

    this.authService.decodedJwt$.subscribe(decodedJwt => {
      this.decodedJwt = decodedJwt;
    });
  }

  private subscribeToUserState() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  private subscribeToFriendState() {
    this.friendService.friends$.subscribe(friends => {
      this.friends = friends;
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
          .joinExistingInboxIfPresent(friendRequest.from._id, this.jwt)
          .pipe(
            tap(inbox => {
              if (inbox) {
                inbox.send('acceptFriendRequest', friendRequest);
                inbox = this.setFriendInboxListeners(inbox);
                this.friendService.setFriendOnline(friendRequest.from._id);
                this.inboxService.updateConnectedInbox(inbox);
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

  createPersonalInbox(): Observable<Room<any>> {
    return this.inboxService.createInbox(this.decodedJwt._id, this.jwt).pipe(
      tap(inbox => {
        this.userService.setOnline(true);
        inbox = this.setPersonalInboxListeners(inbox);
        this.inboxService.setPersonalInbox(inbox);
      })
    );
  }

  joinFriendsInboxesIfPresent(): Observable<Room<any>[]> {
    const friendIds = this.friends.map(friend => friend._id);
    return this.inboxService
      .joinExistingInboxesIfPresent(friendIds, this.jwt)
      .pipe(
        tap(inboxes => {
          if (inboxes.length > 0) {
            const friendInboxes: Room[] = [];
            const friendInboxIds: string[] = [];
            inboxes.forEach(inbox => {
              const friendInbox = this.setFriendInboxListeners(inbox);
              friendInboxes.push(friendInbox);
              friendInboxIds.push(inbox.id);
            });
            this.friendService.setFriendsOnline(friendInboxIds);
            this.inboxService.updateConnectedInboxes(friendInboxes);
          }
        })
      );
  }

  private setPersonalInboxListeners(inbox: Room): Room {
    //     this.colyseusService.hostInbox.onMessage('messageHost', (message: Message) =>
    //       this.handleMessageHostEvent(message)
    //     );
    //   private handleMessageHostEvent(message: Message) {
    //     this.potentialMessage = message;
    //   }

    inbox.onMessage('online', (inboxId: string) => {
      this.friendService.setFriendOnline(inboxId);
    });
    inbox.onMessage('offline', (inboxId: string) => {
      this.friendService.setFriendOffline(inboxId);
    });

    inbox.onMessage('sendFriendRequest', (friendRequest: FriendRequest) => {
      this.friendRequestService.addInboundFriendRequest(friendRequest);
    });

    inbox.onMessage('rejectFriendRequest', (friendRequest: FriendRequest) => {
      this.friendRequestService.removeOutboundFriendRequest(friendRequest);
    });

    inbox.onMessage('revokeFriendRequest', (friendRequest: FriendRequest) => {
      this.friendRequestService.removeInboundFriendRequest(friendRequest);
    });

    inbox.onMessage('acceptFriendRequest', (friendRequest: FriendRequest) => {
      this.friendRequestService.removeOutboundFriendRequest(friendRequest);
      this.friendService.addFriend(friendRequest.to);
      this.friendService.setFriendOnline(friendRequest.to._id);
    });

    inbox.onMessage('removeFriend', (friend: Friend) => {
      this.friendService.removeFriend(friend);
    });

    inbox.onError((code, message) =>
      console.log(
        `An error occurred with the inbox. Error Code: ${code} | Message: ${message}`
      )
    );
    return inbox;
  }

  private setFriendInboxListeners(inbox: Room): Room {
    //       inbox.onMessage('messageUser', (message: Message) =>
    //         this.handleMessageUserEvent(message)
    //       );

    //   private handleMessageUserEvent(message: Message) {
    //     this.potentialMessage = message;
    //   }

    inbox.onMessage('disconnectFriend', (disconnectFriend: Friend) => {
      this.friendService.removeFriend(disconnectFriend);
      this.inboxService.removeConnectedInboxById(disconnectFriend._id);
    });

    inbox.onMessage('dispose', (inboxId: string) => {
      this.friendService.setFriendOffline(inboxId);
      this.inboxService.removeConnectedInboxById(inboxId);
    });
    inbox.onError((code, message) =>
      console.log(
        `An error occurred with the inbox. Error Code: ${code} | Message: ${message}`
      )
    );
    return inbox;
  }
}
