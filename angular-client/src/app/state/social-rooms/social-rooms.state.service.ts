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
import { UserStateService } from '../user/user.state.service';
import { DecodedJwt } from 'src/app/models/decoded-jwt/decoded-jwt';
import { User } from 'src/app/models/user/user';

@Injectable({
  providedIn: 'root',
})
export class SocialRoomsStateService {
  private user: User;
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
    private userStateService: UserStateService,
    private colyseusService: ColyseusService,
    private snackBar: MatSnackBar
  ) {
    this.subscribeToUserState();
  }

  createPersonalRoom(): void {
    this.createRoom(this.decodedJwt._id);
  }

  joinFriendsRoomsIfPresent() {
    const roomIds = this.user.friends.map(friend => friend._id);
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

  private subscribeToUserState() {
    this.userStateService.user$.subscribe(user => {
      this.user = user;
    });
    this.userStateService.decodedJwt$.subscribe(decodedJwt => {
      this.decodedJwt = decodedJwt;
    });
    this.userStateService.jwt$.subscribe(jwt => {
      this.jwt = jwt;
    });
    this.userStateService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) this.leaveAllRooms();
    });
  }

  private isPersonalRoom(roomId: string): boolean {
    return roomId === this.decodedJwt._id;
  }

  private setPersonalRoomListeners(room: Room): Room {
    return room;
  }

  private setFriendRoomListeners(room: Room): Room {
    room.onMessage('dispose', (roomId: string) =>
      this.removeConnectedRoomById(roomId)
    );
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
        room = this.setPersonalRoomListeners(room);
        this.setPersonalRoom(room);
      } else {
        room = this.setFriendRoomListeners(room);
      }
      this.addConnectedRoom(room);
    }
    this.setIsLoading(false);
  };

  private handleConnectedRoomsSuccess = (rooms: Room[]) => {
    if (rooms.length > 0) {
      const updatedRooms = rooms.map(room => {
        if (this.isPersonalRoom(room.id)) {
          room = this.setPersonalRoomListeners(room);
          this.setPersonalRoom(room);
        } else {
          room = this.setFriendRoomListeners(room);
        }
        return room;
      });
      this.addConnectedRooms(updatedRooms);
    }
    this.setIsLoading(false);
  };
}
