import { Injectable } from '@angular/core';
import { Observable, tap, of, catchError, from } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { Room } from 'colyseus.js';
import { UserService } from '../user/user.service';
import { FriendService } from '../friend/friend.service';
import { Friend } from '../friend/friend.model';
import { FriendRequestService } from '../friend-request/friend-request.service';
import { FriendRequest } from '../friend-request/friend-requests.model';
import { AuthService } from '../auth/auth.service';
import { DecodedJwt } from '../auth/decoded-jwt.model';
import { InboxStateService } from './inbox.state.service';

@Injectable({
  providedIn: 'root',
})
export class InboxEffectService {
  private friends: Friend[];
  private decodedJwt: DecodedJwt;
  private jwt: string;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private inboxStateService: InboxStateService,
    private friendService: FriendService,
    private friendRequestService: FriendRequestService,
    private colyseusService: ColyseusService,
    private snackBar: MatSnackBar
  ) {
    this.subscribeToFriendState();
    this.subscribeToAuthState();
  }

  createPersonalInbox(): Observable<Room<any>> {
    return this.createInbox(this.decodedJwt._id);
  }

  joinFriendsInboxesIfPresent(): Observable<Room<any>[]> {
    const inboxIds = this.friends.map(friend => friend._id);
    return this.joinExistingInboxesIfPresent(inboxIds);
  }

  createInbox(inboxId: string): Observable<Room<any>> {
    this.inboxStateService.setIsLoading(true);
    return from(this.colyseusService.createRoom(inboxId, this.jwt)).pipe(
      tap(this.handleConnectedInboxSuccess),
      catchError(this.handleError)
    );
  }

  connectToInbox(inboxId: string): Observable<Room<any>> {
    this.inboxStateService.setIsLoading(true);
    return from(this.colyseusService.connectToRoom(inboxId, this.jwt)).pipe(
      tap(this.handleConnectedInboxSuccess),
      catchError(this.handleError)
    );
  }

  connectToInboxes(inboxIds: string[]): Observable<Room<any>[]> {
    this.inboxStateService.setIsLoading(true);
    return from(this.colyseusService.connectToRooms(inboxIds, this.jwt)).pipe(
      tap(this.handleConnectedInboxesSuccess),
      catchError(this.handleError)
    );
  }

  joinExistingInboxIfPresent(inboxId: string): Observable<Room<any>> {
    this.inboxStateService.setIsLoading(true);
    return from(
      this.colyseusService.joinExistingRoomIfPresent(inboxId, this.jwt)
    ).pipe(tap(this.handleConnectedInboxSuccess), catchError(this.handleError));
  }

  joinExistingInboxesIfPresent(inboxIds: string[]): Observable<Room<any>[]> {
    this.inboxStateService.setIsLoading(true);
    return from(
      this.colyseusService.joinExistingRoomsIfPresent(inboxIds, this.jwt)
    ).pipe(
      tap(this.handleConnectedInboxesSuccess),
      catchError(this.handleError)
    );
  }

  leaveInbox(inbox: Room): Observable<number> {
    this.inboxStateService.setIsLoading(true);
    return from(this.colyseusService.leaveRoom(inbox)).pipe(
      tap(() => {
        this.inboxStateService.removeConnectedInbox(inbox);
        if (this.isPersonalInbox(inbox.id))
          this.inboxStateService.setPersonalInbox(null);
        this.inboxStateService.setIsLoading(false);
      }),
      catchError(this.handleError)
    );
  }

  leaveInboxes(inboxes: Room[]): Observable<number[]> {
    this.inboxStateService.setIsLoading(true);
    return from(this.colyseusService.leaveRooms(inboxes)).pipe(
      tap(() => {
        this.inboxStateService.removeConnectedInboxes(inboxes);
        if (inboxes.some(inbox => this.isPersonalInbox(inbox.id)))
          this.inboxStateService.setPersonalInbox(null);
        this.inboxStateService.setIsLoading(false);
      }),
      catchError(this.handleError)
    );
  }

  private subscribeToFriendState() {
    this.friendService.friends$.subscribe(friends => {
      this.friends = friends;
    });
  }

  private subscribeToAuthState() {
    this.authService.decodedJwt$.subscribe(decodedJwt => {
      this.decodedJwt = decodedJwt;
    });
    this.authService.jwt$.subscribe(jwt => {
      this.jwt = jwt;
    });
  }

  private isPersonalInbox(inboxId: string): boolean {
    return inboxId === this.decodedJwt?._id;
  }

  private setPersonalInboxListeners(inbox: Room): Room {
    //     this.colyseusService.hostInbox.onMessage('messageHost', (message: Message) =>
    //       this.handleMessageHostEvent(message)
    //     );

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

    inbox.onMessage('disconnectFriend', (disconnectFriend: Friend) => {
      this.friendService.removeFriend(disconnectFriend);
      this.inboxStateService.removeConnectedInboxById(disconnectFriend._id);
    });

    inbox.onMessage('dispose', (inboxId: string) => {
      this.friendService.setFriendOffline(inboxId);
      this.inboxStateService.removeConnectedInboxById(inboxId);
    });
    inbox.onError((code, message) =>
      console.log(
        `An error occurred with the inbox. Error Code: ${code} | Message: ${message}`
      )
    );
    return inbox;
  }

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.inboxStateService.setIsLoading(false);
    return of(null);
  };

  private handleConnectedInboxSuccess = (inbox: Room) => {
    if (inbox) {
      if (this.isPersonalInbox(inbox.id)) {
        this.userService.setOnline(true);
        inbox = this.setPersonalInboxListeners(inbox);
        this.inboxStateService.setPersonalInbox(inbox);
      } else {
        this.friendService.setFriendOnline(inbox.id);
        inbox = this.setFriendInboxListeners(inbox);
      }
      this.inboxStateService.addConnectedInbox(inbox);
    }
    this.inboxStateService.setIsLoading(false);
  };

  private handleConnectedInboxesSuccess = (inboxes: Room[]) => {
    if (inboxes.length > 0) {
      let personalInbox: Room | null = null;
      const friendInboxes: Room[] = [];
      const friendInboxIds: string[] = [];

      inboxes.forEach(inbox => {
        if (this.isPersonalInbox(inbox.id)) {
          this.userService.setOnline(true);
          personalInbox = this.setPersonalInboxListeners(inbox);
          this.inboxStateService.setPersonalInbox(personalInbox);
        } else {
          const friendInbox = this.setFriendInboxListeners(inbox);
          friendInboxes.push(friendInbox);
          friendInboxIds.push(inbox.id);
        }
      });
      this.friendService.setFriendsOnline(friendInboxIds);
      this.inboxStateService.addConnectedInboxes([
        ...(personalInbox ? [personalInbox] : []),
        ...friendInboxes,
      ]);
    }
    this.inboxStateService.setIsLoading(false);
  };
}

//   private handleMessageHostEvent(message: Message) {
//     this.potentialMessage = message;
//   }

//   private handleMessageUserEvent(message: Message) {
//     this.potentialMessage = message;
//   }
