import { Injectable } from '@angular/core';
import { Observable, tap, switchMap, map, of, forkJoin } from 'rxjs';
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
import { Message } from '../message/message.model';
import { MessageService } from '../message/message.service';

@Injectable({
  providedIn: 'root',
})
export class SocialOrchestratorService {
  private user: User;
  private friends: Friend[];
  private unviewedMessages: Message[];
  private jwt: string;
  private decodedJwt: DecodedJwt;
  private friendsInboxes: Room<any>[];
  private connectedInboxes: Room<any>[];
  private personalInbox: Room<any>;

  constructor(
    private friendRequestService: FriendRequestService,
    private friendService: FriendService,
    private userService: UserService,
    private authService: AuthService,
    private inboxService: InboxService,
    private messageService: MessageService,
    private colyseusService: ColyseusService
  ) {
    this.subscribeToAuthState();
    this.subscribeToUserState();
    this.subscribeToFriendState();
    this.subscribeToMessageState();
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

  private subscribeToMessageState() {
    this.messageService.unviewedMessages$.subscribe(unviewedMessages => {
      this.unviewedMessages = unviewedMessages;
    });
  }

  private subscribeToInboxState() {
    this.inboxService.friendsInboxes$.subscribe(friendsInboxes => {
      this.friendsInboxes = friendsInboxes;
    });

    this.inboxService.personalInbox$.subscribe(personalInbox => {
      this.personalInbox = personalInbox;
    });

    this.inboxService.connectedInboxes$.subscribe(connectedInboxes => {
      this.connectedInboxes = connectedInboxes;
    });
  }

  setInitialState() {
    this.inboxService.leaveInboxes(this.connectedInboxes).subscribe();
    this.inboxService.setInitialState();
    this.userService.setInitialState();
    this.friendService.setInitialState();
    this.friendRequestService.setInitialState();
    this.messageService.setInitialState();
  }

  connect(decodedJwt: DecodedJwt): Observable<any> {
    return this.userService
      .getUser(decodedJwt._id, {
        friends: true,
        friendRequests: true,
      })
      .pipe(
        tap(user => this.setSocials(user)),
        switchMap(user =>
          forkJoin(
            user.friends.map(friend => this.getAllMessagesBetween(friend))
          )
        ),
        switchMap(() => this.createPersonalInbox()),
        switchMap(() => this.joinFriendsInboxesIfPresent()),
        tap(() => this.sortFriends())
      );
  }

  getAllMessagesBetween(friend: Friend): Observable<Map<string, Message[]>> {
    return this.messageService.getAllBetween(this.user, friend);
  }

  sendMessage(friend: Friend, message: Message): Observable<Message> {
    return this.messageService.send(this.user, friend, message).pipe(
      tap(message => {
        const friendsInbox = this.friendsInboxes.find(
          friendsInbox => friendsInbox.id === message.to._id
        );

        if (friendsInbox) {
          friendsInbox.send('messageHost', message);
        } else {
          this.personalInbox.send('messageUser', message);
        }
      })
    );
  }

  markMessagesAsViewed(
    friend: Friend,
    messages: Message[]
  ): Observable<Message[]> {
    return this.messageService.markAsViewed(this.user, friend, messages);
  }

  deleteFriend(friend: Friend): Observable<Friend> {
    return this.friendService.deleteFriend(this.user, friend).pipe(
      switchMap(deletedFriend => {
        this.messageService.removeMessagesFromFriend(friend);
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
      tap(user => {
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
      ),
      switchMap(user =>
        this.getAllMessagesBetween(friendRequest.from).pipe(map(() => user))
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
    inbox.onMessage('messageHost', (message: Message) => {
      this.messageService.addMessageToFriend(message.from, message);
      this.friendService.reorderFriend(message.from._id, 'front');
    });

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
      this.messageService.removeMessagesFromFriend(friend);
    });

    inbox.onError((code, message) =>
      console.log(
        `An error occurred with the inbox. Error Code: ${code} | Message: ${message}`
      )
    );
    return inbox;
  }

  private setFriendInboxListeners(inbox: Room): Room {
    inbox.onMessage('messageUser', (message: Message) => {
      this.messageService.addMessageToFriend(message.from, message);
      this.friendService.reorderFriend(message.from._id, 'front');
    });

    inbox.onMessage('disconnectFriend', (disconnectedFriend: Friend) => {
      this.friendService.removeFriend(disconnectedFriend);
      this.inboxService.removeConnectedInboxById(disconnectedFriend._id);
      this.messageService.removeMessagesFromFriend(disconnectedFriend);
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

  private setSocials(user: User) {
    this.friendService.setFriends(user.friends);
    this.friendRequestService.setInboundFriendRequests(
      user.inboundFriendRequests
    );
    this.friendRequestService.setOutboundFriendRequests(
      user.outboundFriendRequests
    );
  }

  private sortFriends() {
    this.friends.sort((a, b) => {
      // Check if friend A and friend B have unviewed messages
      const aHasUnviewedMessages = this.unviewedMessages.some(
        msg => msg.from._id === a._id
      );
      const bHasUnviewedMessages = this.unviewedMessages.some(
        msg => msg.from._id === b._id
      );

      // Online with unviewed messages.
      if (
        a.online &&
        aHasUnviewedMessages &&
        (!b.online || !bHasUnviewedMessages)
      ) {
        return -1;
      }
      if (
        b.online &&
        bHasUnviewedMessages &&
        (!a.online || !aHasUnviewedMessages)
      ) {
        return 1;
      }

      // Online without unviewed messages.
      if (
        a.online &&
        !aHasUnviewedMessages &&
        (!b.online || bHasUnviewedMessages)
      ) {
        return -1;
      }
      if (
        b.online &&
        !bHasUnviewedMessages &&
        (!a.online || aHasUnviewedMessages)
      ) {
        return 1;
      }

      // Offline with unviewed messages.
      if (
        !a.online &&
        aHasUnviewedMessages &&
        (b.online || !bHasUnviewedMessages)
      ) {
        return -1;
      }
      if (
        !b.online &&
        bHasUnviewedMessages &&
        (a.online || !aHasUnviewedMessages)
      ) {
        return 1;
      }

      // Offline without unviewed messages.
      // If it reaches this point, it means both a and b are offline without unviewed messages, hence they are equal in terms of sorting.
      return 0;
    });
    this.friendService.setFriends(this.friends);
  }
}
