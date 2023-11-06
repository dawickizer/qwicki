import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserState, initialState } from './user.state';
import {
  isLoadingSelector,
  onlineStatusSelector,
  userSelector,
} from './user.state.selectors';
import { User } from './user.model';
import { OnlineStatus } from 'src/app/models/online-status/online-status';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private _userState = new BehaviorSubject<UserState>(initialState);

  public userState$: Observable<UserState> = this._userState.asObservable();
  public isLoading$ = isLoadingSelector(this.userState$);
  public user$ = userSelector(this.userState$);
  public onlineStatus$ = onlineStatusSelector(this.user$);

  setInitialState() {
    this._userState.next(initialState);
  }

  setUser(user: User): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, user: new User(user) });
  }

  setOnlineStatus(onlineStatus: OnlineStatus): void {
    const currentState = this._userState.value;
    if (!currentState.user) return;
    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, onlineStatus } as User),
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, isLoading });
  }
}
