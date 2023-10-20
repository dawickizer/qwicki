import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, of, catchError, from } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { SocialRoomsState, initialState } from './social-rooms.state';
import {
  connectedRoomsSelector,
  isLoadingSelector,
  friendsRoomsSelector,
  personalRoomSelector,
} from './social-rooms.selectors';
import { Room } from 'colyseus.js';
import { DecodedJwt } from 'src/app/models/decoded-jwt/decoded-jwt';
import { AuthStateService } from '../auth/auth.state.service';
import { FriendRequestsStateService } from '../friend-requests/friend-requests.state.service';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';
import { UserService } from '../user/user.service';
import { FriendService } from '../friend/friend.service';
import { Friend } from '../friend/friend.model';

@Injectable({
  providedIn: 'root',
})
export class SocialRoomsStateService {
  private friends: Friend[];
  private decodedJwt: DecodedJwt;
  private jwt: string;
  private _socialRoomsState = new BehaviorSubject<SocialRoomsState>(
    initialState
  );

  public socialRoomsState$: Observable<SocialRoomsState> =
    this._socialRoomsState.asObservable();
  public isLoading$ = isLoadingSelector(this.socialRoomsState$);
  public personalRoom$ = personalRoomSelector(this.socialRoomsState$);
  public connectedRooms$ = connectedRoomsSelector(this.socialRoomsState$);
  public friendsRooms$ = friendsRoomsSelector(this.socialRoomsState$);

  constructor(
    private userService: UserService,
    private authStateService: AuthStateService,
    private friendService: FriendService,
    private friendRequestsStateService: FriendRequestsStateService,
    private colyseusService: ColyseusService,
    private snackBar: MatSnackBar
  ) {
    this.subscribeToFriendState();
    this.subscribeToAuthState();
  }

  createPersonalRoom(): void {
    this.createRoom(this.decodedJwt._id);
  }

  joinFriendsRoomsIfPresent() {
    const roomIds = this.friends.map(friend => friend._id);
    this.joinExistingRoomsIfPresent(roomIds);
  }

  createRoom(roomId: string): void {
    this.setIsLoading(true);
    from(this.colyseusService.createRoom(roomId, this.jwt))
      .pipe(tap(this.handleConnectedRoomSuccess), catchError(this.handleError))
      .subscribe();
  }

  connectToRoom(roomId: string): void {
    this.setIsLoading(true);
    from(this.colyseusService.connectToRoom(roomId, this.jwt))
      .pipe(tap(this.handleConnectedRoomSuccess), catchError(this.handleError))
      .subscribe();
  }

  connectToRooms(roomIds: string[]): void {
    this.setIsLoading(true);
    from(this.colyseusService.connectToRooms(roomIds, this.jwt))
      .pipe(tap(this.handleConnectedRoomsSuccess), catchError(this.handleError))
      .subscribe();
  }

  joinExistingRoomIfPresent(roomId: string): void {
    this.setIsLoading(true);
    from(this.colyseusService.joinExistingRoomIfPresent(roomId, this.jwt))
      .pipe(tap(this.handleConnectedRoomSuccess), catchError(this.handleError))
      .subscribe();
  }

  joinExistingRoomsIfPresent(roomIds: string[]): void {
    this.setIsLoading(true);
    from(this.colyseusService.joinExistingRoomsIfPresent(roomIds, this.jwt))
      .pipe(tap(this.handleConnectedRoomsSuccess), catchError(this.handleError))
      .subscribe();
  }

  leaveRoom(room: Room): void {
    this.setIsLoading(true);
    from(this.colyseusService.leaveRoom(room))
      .pipe(
        tap(() => {
          this.removeConnectedRoom(room);
          if (this.isPersonalRoom(room.id)) this.setPersonalRoom(null);
          this.setIsLoading(false);
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  leaveRooms(rooms: Room[]): void {
    this.setIsLoading(true);
    from(this.colyseusService.leaveRooms(rooms))
      .pipe(
        tap(() => {
          this.removeConnectedRooms(rooms);
          if (rooms.some(room => this.isPersonalRoom(room.id)))
            this.setPersonalRoom(null);
          this.setIsLoading(false);
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  leaveAllRooms(): void {
    this.setIsLoading(true);
    const currentState = this._socialRoomsState.value;
    const rooms = [...currentState.connectedRooms];
    if (currentState.personalRoom) {
      rooms.push(currentState.personalRoom);
    }

    from(this.colyseusService.leaveRooms(rooms))
      .pipe(
        tap(() => {
          this.setInitialState();
          this.setIsLoading(false);
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  setInitialState() {
    this._socialRoomsState.next(initialState);
  }

  setPersonalRoom(personalRoom: Room): void {
    const currentState = this._socialRoomsState.value;
    this._socialRoomsState.next({ ...currentState, personalRoom });
  }

  addConnectedRoom(room: Room): void {
    const currentState = this._socialRoomsState.value;
    const updatedConnectedRooms = [...currentState.connectedRooms, room];
    this._socialRoomsState.next({
      ...currentState,
      connectedRooms: updatedConnectedRooms,
    });
  }

  addConnectedRooms(rooms: Room[]): void {
    const currentState = this._socialRoomsState.value;
    const updatedConnectedRooms = [...currentState.connectedRooms, ...rooms];
    this._socialRoomsState.next({
      ...currentState,
      connectedRooms: updatedConnectedRooms,
    });
  }

  removeConnectedRoomById(roomId: string): void {
    const currentState = this._socialRoomsState.value;
    const updatedConnectedRooms = currentState.connectedRooms.filter(
      r => r.id !== roomId
    );
    this._socialRoomsState.next({
      ...currentState,
      connectedRooms: updatedConnectedRooms,
    });
  }

  removeConnectedRoom(room: Room): void {
    const currentState = this._socialRoomsState.value;
    const updatedConnectedRooms = currentState.connectedRooms.filter(
      r => r.id !== room.id
    );
    this._socialRoomsState.next({
      ...currentState,
      connectedRooms: updatedConnectedRooms,
    });
  }

  removeConnectedRooms(roomsToRemove: Room[]): void {
    const currentState = this._socialRoomsState.value;
    const roomIdsToRemove = roomsToRemove.map(room => room.id);
    const updatedConnectedRooms = currentState.connectedRooms.filter(
      room => !roomIdsToRemove.includes(room.id)
    );
    this._socialRoomsState.next({
      ...currentState,
      connectedRooms: updatedConnectedRooms,
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._socialRoomsState.value;
    this._socialRoomsState.next({ ...currentState, isLoading });
  }

  private subscribeToFriendState() {
    this.friendService.friends$.subscribe(friends => {
      this.friends = friends;
    });
  }

  private subscribeToAuthState() {
    this.authStateService.decodedJwt$.subscribe(decodedJwt => {
      this.decodedJwt = decodedJwt;
    });
    this.authStateService.jwt$.subscribe(jwt => {
      this.jwt = jwt;
    });
    this.authStateService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) this.leaveAllRooms();
    });
  }

  private isPersonalRoom(roomId: string): boolean {
    return roomId === this.decodedJwt._id;
  }

  private setPersonalRoomListeners(room: Room): Room {
    //     this.colyseusService.hostRoom.onMessage('messageHost', (message: Message) =>
    //       this.handleMessageHostEvent(message)
    //     );

    room.onMessage('online', (roomId: string) => {
      this.friendService.setFriendOnline(roomId);
    });
    room.onMessage('offline', (roomId: string) => {
      this.friendService.setFriendOffline(roomId);
    });

    room.onMessage('sendFriendRequest', (friendRequest: FriendRequest) => {
      this.friendRequestsStateService.addInboundFriendRequest(friendRequest);
    });

    room.onMessage('rejectFriendRequest', (friendRequest: FriendRequest) => {
      this.friendRequestsStateService.removeOutboundFriendRequest(
        friendRequest
      );
    });

    room.onMessage('revokeFriendRequest', (friendRequest: FriendRequest) => {
      this.friendRequestsStateService.removeInboundFriendRequest(friendRequest);
    });

    room.onMessage('acceptFriendRequest', (friendRequest: FriendRequest) => {
      this.friendRequestsStateService.removeOutboundFriendRequest(
        friendRequest
      );
      this.friendService.addFriend(friendRequest.to);
      this.joinExistingRoomIfPresent(friendRequest.from._id);
    });

    room.onMessage('removeFriend', (friend: Friend) => {
      this.friendService.removeFriend(friend);
    });

    room.onError((code, message) =>
      console.log(
        `An error occurred with the room. Error Code: ${code} | Message: ${message}`
      )
    );
    return room;
  }

  private setFriendRoomListeners(room: Room): Room {
    //       room.onMessage('disconnectFriend', (disconnectFriend: User) =>
    //         this.handleDisconnectFriendEvent(disconnectFriend)
    //       );
    //       room.onMessage('messageUser', (message: Message) =>
    //         this.handleMessageUserEvent(message)
    //       );

    room.onMessage('dispose', (roomId: string) => {
      this.friendService.setFriendOffline(roomId);
      this.removeConnectedRoomById(roomId);
    });
    room.onError((code, message) =>
      console.log(
        `An error occurred with the room. Error Code: ${code} | Message: ${message}`
      )
    );
    return room;
  }

  private handleError = (error: any): Observable<null> => {
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.setIsLoading(false);
    return of(null);
  };

  private handleConnectedRoomSuccess = (room: Room) => {
    if (room) {
      if (this.isPersonalRoom(room.id)) {
        this.userService.setOnline(true);
        room = this.setPersonalRoomListeners(room);
        this.setPersonalRoom(room);
      } else {
        this.friendService.setFriendOnline(room.id);
        room = this.setFriendRoomListeners(room);
      }
      this.addConnectedRoom(room);
    }
    this.setIsLoading(false);
  };

  private handleConnectedRoomsSuccess = (rooms: Room[]) => {
    if (rooms.length > 0) {
      let personalRoom: Room | null = null;
      const friendRooms: Room[] = [];
      const friendRoomIds: string[] = [];

      rooms.forEach(room => {
        if (this.isPersonalRoom(room.id)) {
          this.userService.setOnline(true);
          personalRoom = this.setPersonalRoomListeners(room);
          this.setPersonalRoom(personalRoom);
        } else {
          const friendRoom = this.setFriendRoomListeners(room);
          friendRooms.push(friendRoom);
          friendRoomIds.push(room.id);
        }
      });
      this.friendService.setFriendsOnline(friendRoomIds);
      this.addConnectedRooms([
        ...(personalRoom ? [personalRoom] : []),
        ...friendRooms,
      ]);
    }
    this.setIsLoading(false);
  };
}

//   private handleDisconnectFriendEvent(disconnectFriend: User) {
//     this.colyseusService.host.friends =
//       this.colyseusService.host.friends.filter(
//         friend => friend._id !== disconnectFriend._id
//       );
//     this.updateFriends();
//     this.colyseusService.removeRoomById(disconnectFriend._id);
//   }

//   private handleMessageHostEvent(message: Message) {
//     this.potentialMessage = message;
//   }

//   private handleMessageUserEvent(message: Message) {
//     this.potentialMessage = message;
//   }
