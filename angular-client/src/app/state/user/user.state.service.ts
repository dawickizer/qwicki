import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserState, initialState } from './user.state';
import {
  isLoadingSelector,
  onlineSelector,
  userSelector,
} from './user.state.selectors';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private _userState = new BehaviorSubject<UserState>(initialState);

  public userState$: Observable<UserState> = this._userState.asObservable();
  public isLoading$ = isLoadingSelector(this.userState$);
  public user$ = userSelector(this.userState$);
  public online$ = onlineSelector(this.user$);

  setInitialState() {
    this._userState.next(initialState);
  }

  setUser(user: User): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, user: new User(user) });
  }

  setOnline(online: boolean): void {
    const currentState = this._userState.value;
    if (!currentState.user) return;
    this._userState.next({
      ...currentState,
      user: new User({ ...currentState.user, online } as User),
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, isLoading });
  }
}
