import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, of, catchError, from } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { SocialRoomsState, initialState } from './social-rooms.state';
import {
  connectedRoomsSelector,
  isLoadingSelector,
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

  constructor(
    private userStateService: UserStateService,
    private colyseusService: ColyseusService,
    private snackBar: MatSnackBar
  ) {
    this.userStateService.user$.subscribe(user => {
      this.user = user;
    });
    this.userStateService.decodedJwt$.subscribe(decodedJwt => {
      this.decodedJwt = decodedJwt;
    });
    this.userStateService.jwt$.subscribe(jwt => {
      this.jwt = jwt;
    });
  }

  createPersonalRoom(): void {
    this.createRoom(this.decodedJwt._id);
  }

  connectToOnlineFriendsRooms() {
    const roomIds = this.user.onlineFriends.map(
      onlineFriend => onlineFriend._id
    );
    this.connectToRooms(roomIds);
  }

  createRoom(roomId: string): void {
    this.setIsLoading(true);
    from(this.colyseusService.createRoomXXX(roomId, this.jwt))
      .pipe(
        tap(room => {
          if (room.id === this.decodedJwt._id) this.setPersonalRoom(room);
          this.addConnectedRoom(room);
          this.setIsLoading(false);
        }),
        catchError(error => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
          this.setIsLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  connectToRoom(roomId: string): void {
    this.setIsLoading(true);
    from(this.colyseusService.connectToRoomXXX(roomId, this.jwt))
      .pipe(
        tap(room => {
          this.addConnectedRoom(room);
          if (room.id === this.decodedJwt._id) this.setPersonalRoom(room);
          this.setIsLoading(false);
        }),
        catchError(error => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
          this.setIsLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  connectToRooms(roomIds: string[]): void {
    this.setIsLoading(true);
    from(this.colyseusService.connectToRoomsXXX(roomIds, this.jwt))
      .pipe(
        tap(rooms => {
          this.addConnectedRooms(rooms);
          const personalRoom = rooms.find(
            room => room.id === this.decodedJwt._id
          );
          if (personalRoom) {
            this.setPersonalRoom(personalRoom);
          }
          this.setIsLoading(false);
        }),
        catchError(error => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
          this.setIsLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  joinExistingRoomIfPresent(roomId: string): void {
    this.setIsLoading(true);
    from(this.colyseusService.joinExistingRoomIfPresentXXX(roomId, this.jwt))
      .pipe(
        tap(room => {
          if (room) this.addConnectedRoom(room);
          if (room.id === this.decodedJwt._id) this.setPersonalRoom(room);
          this.setIsLoading(false);
        }),
        catchError(error => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
          this.setIsLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  leaveRoom(room: Room): void {
    this.setIsLoading(true);
    from(this.colyseusService.leaveRoomXXX(room))
      .pipe(
        tap(() => {
          this.removeConnectedRoom(room);
          if (room.id === this.decodedJwt._id) this.setPersonalRoom(null);
          this.setIsLoading(false);
        }),
        catchError(error => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
          this.setIsLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  leaveRooms(rooms: Room[]): void {
    this.setIsLoading(true);
    from(this.colyseusService.leaveRoomsXXX(rooms))
      .pipe(
        tap(() => {
          this.removeConnectedRooms(rooms);
          if (rooms.some(room => room.id === this.decodedJwt._id))
            this.setPersonalRoom(null);
          this.setIsLoading(false);
        }),
        catchError(error => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
          this.setIsLoading(false);
          return of(null);
        })
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

    from(this.colyseusService.leaveRoomsXXX(rooms))
      .pipe(
        tap(() => {
          this.setInitialState();
          this.setIsLoading(false);
        }),
        catchError(error => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
          this.setIsLoading(false);
          return of(null);
        })
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
}
