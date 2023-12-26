import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserState, initialState } from './user.state';
import {
  activitySelector,
  gameMapSelector,
  gameModeSelector,
  gameTypeSelector,
  isLoadingSelector,
  presenceSelector,
  queueTypeSelector,
  userSelector,
} from './user.state.selectors';
import { User } from './user.model';
import { Presence } from 'src/app/types/presence/presence.type';
import { GameMap } from 'src/app/types/game-map/game-map.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';
import { Activity } from 'src/app/types/activity/activity.type';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private _userState = new BehaviorSubject<UserState>(initialState);

  public userState$: Observable<UserState> = this._userState.asObservable();
  public isLoading$ = isLoadingSelector(this.userState$);
  public user$ = userSelector(this.userState$);
  public presence$ = presenceSelector(this.user$);
  public activity$ = activitySelector(this.user$);
  public queueType$ = queueTypeSelector(this.user$);
  public gameType$ = gameTypeSelector(this.user$);
  public gameMode$ = gameModeSelector(this.user$);
  public gameMap$ = gameMapSelector(this.user$);

  setInitialState() {
    this._userState.next(initialState);
  }

  setUser(user: User): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, user: new User(user) });
  }

  setPresence(presence: Presence): void {
    const currentState = this._userState.value;
    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, presence }),
    });
  }

  setActivity(activity: Activity): void {
    const currentState = this._userState.value;
    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, activity }),
    });
  }

  setQueueType(queueType: QueueType): void {
    const currentState = this._userState.value;
    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, queueType }),
    });
  }

  setGameType(gameType: GameType): void {
    const currentState = this._userState.value;
    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, gameType }),
    });
  }

  setGameMode(gameMode: GameMode): void {
    const currentState = this._userState.value;
    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, gameMode }),
    });
  }

  setGameMap(gameMap: GameMap): void {
    const currentState = this._userState.value;
    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, gameMap }),
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, isLoading });
  }
}
