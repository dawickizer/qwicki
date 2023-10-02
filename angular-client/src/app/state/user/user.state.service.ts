import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, of, catchError } from 'rxjs';
import { UserState, initialState } from './user.state';
import { User } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  isLoadingSelector,
  onlineSelector,
  userSelector,
} from './user.state.selectors';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private _userState = new BehaviorSubject<UserState>(initialState);

  public userState$: Observable<UserState> = this._userState.asObservable();
  public isLoading$ = isLoadingSelector(this.userState$);
  public user$ = userSelector(this.userState$);
  public online$ = onlineSelector(this.user$);

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  // Side effects
  getUser(
    id: string,
    options?: { friends?: boolean; friendRequests?: boolean }
  ): Observable<User> {
    this.setIsLoading(true);
    return this.userService.get(id, options).pipe(
      tap(user => {
        this.setUser(user);
        this.setIsLoading(false);
        this.snackBar.open(`Hello, ${user.username}`, 'Dismiss', {
          duration: 5000,
        });
      }),
      catchError(this.handleError)
    );
  }

  updateUser(user: User): void {
    this.setIsLoading(true);
    this.userService
      .update(user)
      .pipe(
        tap(user => {
          this.setUser(user);
          this.setIsLoading(false);
          this.snackBar.open(
            'Your information has been successfully updated!',
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  deleteUser(user: User): void {
    this.setIsLoading(true);
    this.userService
      .delete(user)
      .pipe(
        tap(() => {
          this.setUser(null);
          this.setIsLoading(false);
          this.snackBar.open(
            'Your account has been successfully deleted!',
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  // Pure state

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

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.setIsLoading(false);
    return of(null);
  };
}
