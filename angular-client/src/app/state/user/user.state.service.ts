import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserState, initialState } from './user.state';
import {
  activitySelector,
  gameTypeSelector,
  isLoadingSelector,
  presenceSelector,
  queueTypeSelector,
  statusSelector,
  userSelector,
} from './user.state.selectors';
import { User } from './user.model';
import { Status } from 'src/app/models/status/status.model';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private _userState = new BehaviorSubject<UserState>(initialState);

  public userState$: Observable<UserState> = this._userState.asObservable();
  public isLoading$ = isLoadingSelector(this.userState$);
  public user$ = userSelector(this.userState$);
  public status$ = statusSelector(this.user$);
  public presence$ = presenceSelector(this.status$);
  public activity$ = activitySelector(this.status$);
  public queueType$ = queueTypeSelector(this.status$);
  public gameType$ = gameTypeSelector(this.status$);

  setInitialState() {
    this._userState.next(initialState);
  }

  setUser(user: User): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, user: new User(user) });
  }

  setStatus(status: Status): void {
    const currentState = this._userState.value;
    if (!currentState.user) return;
    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, status } as User),
    });
  }

  updateStatus(status: Partial<Status>): void {
    const currentState = this._userState.value;
    if (!currentState.user) return;

    // Merge new status with existing status
    const updatedStatus = { ...currentState.user.status, ...status };

    // Update the user with the new status
    const updatedUser = new User({
      ...currentState.user,
      status: updatedStatus,
    });

    // Emit the updated user state
    this._userState.next({
      ...currentState,
      user: updatedUser,
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, isLoading });
  }
}
