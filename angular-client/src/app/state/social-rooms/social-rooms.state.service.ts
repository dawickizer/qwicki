import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, of, catchError, from } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { SocialRoomsState, initialState } from './soical-rooms.state';
import {
  isLoadingSelector,
  personalRoomSelector,
} from './social-rooms.selectors';
import { Room } from 'colyseus.js';
import { UserStateService } from '../user/user.state.service';

@Injectable({
  providedIn: 'root',
})
export class SocialRoomsStateService {
  private decodedJwt: any;
  private jwt: string;
  private _socialRoomsState = new BehaviorSubject<SocialRoomsState>(
    initialState
  );

  public socialRoomsState$: Observable<SocialRoomsState> =
    this._socialRoomsState.asObservable();
  public isLoading$ = isLoadingSelector(this.socialRoomsState$);
  public personalRoom$ = personalRoomSelector(this.socialRoomsState$);

  constructor(
    private userStateService: UserStateService,
    private colyseusService: ColyseusService,
    private snackBar: MatSnackBar
  ) {
    this.userStateService.user$.subscribe(decodedJwt => {
      this.decodedJwt = decodedJwt;
    });
    this.userStateService.jwt$.subscribe(jwt => {
      this.jwt = jwt;
    });
  }

  createPersonalRoom(): void {
    this.setIsLoading(true);
    from(this.colyseusService.createRoomXXX(this.decodedJwt._id, this.jwt))
      .pipe(
        tap(room => {
          this.setPersonalRoom(room);
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

  setIsLoading(isLoading: boolean): void {
    const currentState = this._socialRoomsState.value;
    this._socialRoomsState.next({ ...currentState, isLoading });
  }
}
