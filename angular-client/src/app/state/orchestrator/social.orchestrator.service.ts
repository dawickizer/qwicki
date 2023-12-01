import { Injectable } from '@angular/core';
import {
  Observable,
  tap,
  switchMap,
  of,
  forkJoin,
  mergeMap,
  defaultIfEmpty,
} from 'rxjs';
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
import { InviteService } from '../invite/invite.service';
import { Invite } from '../invite/invite.model';
import { Status } from 'src/app/models/status/status.model';

@Injectable({
  providedIn: 'root',
})
export class SocialOrchestratorService {
  private user: User;
  private friends: Friend[];
  private unviewedMessages: Message[];
  private jwt: string;
  private decodedJwt: DecodedJwt;
  private connectedInboxes: Room<any>[];

  constructor(
    private friendRequestService: FriendRequestService,
    private friendService: FriendService,
    private userService: UserService,
    private authService: AuthService,
    private inboxService: InboxService,
    private messageService: MessageService,
    private inviteService: InviteService
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
    this.inboxService.connectedInboxes$.subscribe(
      connectedInboxes => (this.connectedInboxes = connectedInboxes)
    );
  }

  setInitialState() {
    this.inboxService
      .leaveInboxes(this.connectedInboxes, this.decodedJwt)
      .subscribe();
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

  createPersonalInbox(): Observable<Room<any>> {
    return this.inboxService
      .createInbox(this.decodedJwt._id, {
        jwt: this.jwt,
        status: { presence: 'Online', activity: 'In Lobby' },
      })
      .pipe(
        tap(inbox => {
          this.userService.updateStatus({ presence: 'Online' });
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
        status: this.user.status,
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
              const currentStatus = inbox.state.host.status;
              if (currentStatus) {
                inbox = this.setFriendInboxListeners(inbox);
                this.friendService.updateFriendStatus(
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
                  this.friendService.updateFriendStatus(
                    state.host._id,
                    state.host.status
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

    inbox.onMessage('status', (friend: { id: string; status: Status }) => {
      this.friendService.updateFriendStatus(friend.id, friend.status);
    });

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
      (data: { friendRequest: FriendRequest; status: Status }) => {
        this.friendRequestService.removeOutboundFriendRequest(
          data.friendRequest
        );
        this.friendService.addFriend(data.friendRequest.to);
        this.friendService.updateFriendStatus(
          data.friendRequest.to._id,
          data.status
        );

        this.messageService
          .getAllBetween(this.user, data.friendRequest.to)
          .subscribe();
      }
    );

    inbox.onMessage('sendInviteToHost', (invite: Invite) => {
      this.inviteService.receiveInvite(invite).subscribe();
    });

    inbox.onMessage('revokeInviteToHost', (invite: Invite) => {
      this.inviteService.removeInboundInvite(invite);
    });

    inbox.onMessage('rejectInviteToHost', (invite: Invite) => {
      this.inviteService.removeOutboundInvite(invite);
    });

    inbox.onMessage('acceptInviteToHost', (invite: Invite) => {
      this.inviteService.removeOutboundInvite(invite);
    });

    inbox.onMessage('removeFriend', (friend: Friend) => {
      this.friendService.removeFriend(friend);
      this.messageService.removeMessagesFromFriend(friend);
      this.inviteService.removeInvitesFromFriend(friend);
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

    inbox.onMessage('revokeInviteToUser', (invite: Invite) => {
      this.inviteService.removeInboundInvite(invite);
    });

    inbox.onMessage('rejectInviteToUser', (invite: Invite) => {
      this.inviteService.removeOutboundInvite(invite);
    });

    inbox.onMessage('acceptInviteToUser', (invite: Invite) => {
      this.inviteService.removeOutboundInvite(invite);
    });

    inbox.onMessage('status', (friend: { id: string; status: Status }) => {
      this.friendService.updateFriendStatus(friend.id, friend.status);
    });

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
      this.inviteService.removeInvitesFromFriend(disconnectedFriend);
    });

    inbox.onMessage('dispose', (inboxId: string) => {
      this.friendService.updateFriendStatus(inboxId, { presence: 'Offline' });
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
