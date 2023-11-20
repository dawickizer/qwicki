import { Injectable } from '@angular/core';
import {
  Observable,
  tap,
  switchMap,
  map,
  of,
  forkJoin,
  mergeMap,
  defaultIfEmpty,
} from 'rxjs';
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
import { OnlineStatus } from 'src/app/models/online-status/online-status';
import { InactivityService } from '../inactivity/inactivity.service';
import { InviteService } from '../invite/invite.service';
import { Invite } from '../invite/invite.model';

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
    private inactivityService: InactivityService,
    private messageService: MessageService,
    private inviteService: InviteService,
    private colyseusService: ColyseusService
  ) {
    this.subscribeToState();
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
    this.inboxService.friendsInboxes$.subscribe(
      friendsInboxes => (this.friendsInboxes = friendsInboxes)
    );
    this.inboxService.personalInbox$.subscribe(
      personalInbox => (this.personalInbox = personalInbox)
    );
    this.inboxService.connectedInboxes$.subscribe(
      connectedInboxes => (this.connectedInboxes = connectedInboxes)
    );

    // There is a potential race condition here but the way my logic is coded its not happening. If the inactivity onlineStatus ever gets updaetd before the user does...there could be a scenario where the setUserOnlineStatus doesnt fire off
    this.inactivityService.onlineStatus$.subscribe(onlineStatus => {
      if (
        !this.user ||
        (this.user.onlineStatus === 'offline' && onlineStatus === 'away')
      )
        return;
      this.setUserOnlineStatus(onlineStatus).subscribe();
    });
  }

  setInitialState() {
    this.inboxService.leaveInboxes(this.connectedInboxes).subscribe();
    this.inboxService.setInitialState();
    this.userService.setInitialState();
    this.friendService.setInitialState();
    this.friendRequestService.setInitialState();
    this.messageService.setInitialState();
    this.inviteService.setInitialState();
  }

  connect(decodedJwt: DecodedJwt): Observable<any> {
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
              user.friends.map(friend => this.getAllMessagesBetween(friend))
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

  inviteFriend(friend: Friend): Observable<Invite> {

    let invite = new Invite();
    invite.to = friend;
    invite.type = 'party';
    invite.roomId = '123';
    invite.metadata = "Domination";    
  
    return this.inviteService.sendInvite(this.user, invite).pipe(
      tap(invite => {
        const friendsInbox = this.friendsInboxes.find(
          friendsInbox => friendsInbox.id === invite.to._id
        );
        if (friendsInbox) {
          friendsInbox.send('sendInviteToHost', invite);
        } else {
          this.personalInbox.send('sendInviteToUser', invite);
        }
      })
    );
  }

  revokeInvite(invite: Invite): Observable<Invite> {
    return this.inviteService
      .revokeInvite(this.user, invite)
      .pipe(
        tap(async invite => {
          // const friendsInbox = this.friendsInboxes.find(
          //   friendsInbox => friendsInbox.id === invite.to._id
          // );
          // if (friendsInbox) {
          //   friendsInbox.send('revokeInviteToHost', invite);
          // } else {
          //   this.personalInbox.send('revokeInviteToUser', invite);
          // }
        })
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

  notifyFriendUserIsTyping(friend: Friend, isTyping: boolean): Observable<any> {
    return new Observable(subscriber => {
      const friendsInbox = this.friendsInboxes.find(
        friendsInbox => friendsInbox.id === friend._id
      );

      if (friendsInbox) {
        friendsInbox.send('userIsTyping', {
          friendId: this.user._id,
          isTyping,
        });
        subscriber.next({ success: true });
        subscriber.complete();
      } else {
        this.personalInbox.send('hostIsTyping', {
          friendId: friend._id,
          isTyping,
        });
        subscriber.next({ success: true });
        subscriber.complete();
      }
    });
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
          .joinExistingInboxIfPresent(friendRequest.from._id, {
            jwt: this.jwt,
            onlineStatus: this.user.onlineStatus,
          })
          .pipe(
            tap(inbox => {
              // keep in mind that this logic is async and the tap will proceed while this is lagging behind
              // for now that is fine since nothing after this really depends on the logic inside of onStateChange()
              if (inbox) {
                inbox.onStateChange.once(state => {
                  inbox.send('acceptFriendRequest', friendRequest);
                  inbox = this.setFriendInboxListeners(inbox);
                  this.friendService.setFriendOnlineStatus(
                    friendRequest.from._id,
                    state.host.onlineStatus
                  );
                  this.inboxService.updateConnectedInbox(inbox);
                });
              } else {
                this.friendService.setFriendOnlineStatus(
                  friendRequest.from._id,
                  'offline'
                );
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
            { jwt: this.jwt }
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
            { jwt: this.jwt }
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
            { jwt: this.jwt }
          );
          if (inbox) {
            inbox.send('rejectFriendRequest', friendRequest);
            this.colyseusService.leaveRoom(inbox);
          }
        })
      );
  }

  createPersonalInbox(): Observable<Room<any>> {
    return this.inboxService
      .createInbox(this.decodedJwt._id, {
        jwt: this.jwt,
        onlineStatus: 'online',
      })
      .pipe(
        tap(inbox => {
          this.userService.setOnlineStatus('online');
          inbox = this.setPersonalInboxListeners(inbox);
          this.inboxService.setPersonalInbox(inbox);
        })
      );
  }

  joinFriendsInboxesIfPresent(): Observable<Room<any>[]> {
    const friendIds = this.friends.map(friend => friend._id);

    return this.inboxService
      .joinExistingInboxesIfPresent(friendIds, {
        jwt: this.jwt,
        onlineStatus: this.user.onlineStatus,
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
              const currentStatus = inbox.state.host.onlineStatus;
              if (currentStatus) {
                inbox = this.setFriendInboxListeners(inbox);
                this.friendService.setFriendOnlineStatus(
                  inbox.state.host._id,
                  currentStatus
                );
                this.inboxService.updateConnectedInbox(inbox);
                subscriber.next(inbox);
                subscriber.complete();
              } else {
                // Set up the .once() listener if the state is not yet available.
                inbox.onStateChange.once(state => {
                  inbox = this.setFriendInboxListeners(inbox);
                  this.friendService.setFriendOnlineStatus(
                    state.host._id,
                    state.host.onlineStatus
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

  setUserOnlineStatus(onlineStatus: OnlineStatus): Observable<OnlineStatus> {
    return new Observable(subscriber => {
      this.personalInbox.send('setHostOnlineStatus', onlineStatus);
      this.friendsInboxes.forEach(friendsInbox => {
        friendsInbox.send('notifyHostOnlineStatus', {
          id: this.user._id,
          onlineStatus,
        });
      });
      this.userService.setOnlineStatus(onlineStatus);
      subscriber.next(onlineStatus);
      subscriber.complete();
    });
  }

  private setPersonalInboxListeners(inbox: Room): Room {
    inbox.onMessage('messageHost', (message: Message) => {
      this.messageService.addMessageToFriend(message.from, message);
      this.friendService.reorderFriend(message.from._id, 'front');
    });

    inbox.onMessage(
      'userIsTyping',
      (data: { friendId: string; isTyping: boolean }) => {
        this.friendService.setFriendIsTyping(data.friendId, data.isTyping);
      }
    );

    inbox.onMessage(
      'onlineStatus',
      (friend: { id: string; onlineStatus: OnlineStatus }) => {
        this.friendService.setFriendOnlineStatus(
          friend.id,
          friend.onlineStatus
        );
      }
    );

    inbox.onMessage('sendFriendRequest', (friendRequest: FriendRequest) => {
      this.friendRequestService.receiveFriendRequest(friendRequest).subscribe();
    });

    inbox.onMessage('rejectFriendRequest', (friendRequest: FriendRequest) => {
      this.friendRequestService.removeOutboundFriendRequest(friendRequest);
    });

    inbox.onMessage('revokeFriendRequest', (friendRequest: FriendRequest) => {
      this.friendRequestService.removeInboundFriendRequest(friendRequest);
    });

    inbox.onMessage(
      'acceptFriendRequest',
      (data: { friendRequest: FriendRequest; onlineStatus: OnlineStatus }) => {
        this.friendRequestService.removeOutboundFriendRequest(
          data.friendRequest
        );
        this.friendService.addFriend(data.friendRequest.to);
        this.friendService.setFriendOnlineStatus(
          data.friendRequest.to._id,
          data.onlineStatus
        );
        this.getAllMessagesBetween(data.friendRequest.to).subscribe();
      }
    );

    inbox.onMessage('sendInviteToHost', (invite: Invite) => {
      this.inviteService.receiveInvite(invite).subscribe();
    });

    inbox.onMessage('rejectInvite', (invite: Invite) => {
      console.log(invite);
    });

    inbox.onMessage('revokeInvite', (invite: Invite) => {
      console.log(invite);
    });

    inbox.onMessage('acceptInvite', (invite: Invite) => {
      console.log(invite);
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

    inbox.onMessage('sendInviteToUser', (invite: Invite) => {
      this.inviteService.receiveInvite(invite).subscribe();
    });

    inbox.onMessage(
      'onlineStatus',
      (friend: { id: string; onlineStatus: OnlineStatus }) => {
        this.friendService.setFriendOnlineStatus(
          friend.id,
          friend.onlineStatus
        );
      }
    );

    inbox.onMessage(
      'hostIsTyping',
      (data: { friendId: string; isTyping: boolean }) => {
        this.friendService.setFriendIsTyping(data.friendId, data.isTyping);
      }
    );

    inbox.onMessage('disconnectFriend', (disconnectedFriend: Friend) => {
      this.friendService.removeFriend(disconnectedFriend);
      this.inboxService.removeConnectedInboxById(disconnectedFriend._id);
      this.messageService.removeMessagesFromFriend(disconnectedFriend);
    });

    inbox.onMessage('dispose', (inboxId: string) => {
      this.friendService.setFriendOnlineStatus(inboxId, 'offline');
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

    this.inviteService.setInboundInvites(user.inboundInvites);
    this.inviteService.setOutboundInvites(user.outboundInvites);
  }
}
