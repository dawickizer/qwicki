import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStateService } from './user.state.service';
import { UserApiService } from './user.api.service';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserEffectService {
  constructor(
    private userApiService: UserApiService,
    private userStateService: UserStateService,
    private snackBar: MatSnackBar
  ) {}

  getUser(
    id: string,
    options?: { friends?: boolean; friendRequests?: boolean; invites?: boolean }
  ): Observable<User> {
    this.userStateService.setIsLoading(true);
    return this.userApiService.get(id, options).pipe(
      tap(user => {
        this.userStateService.setUser(user);
        this.userStateService.setIsLoading(false);
        this.snackBar.open(`Hello, ${user.username}`, 'Dismiss', {
          duration: 5000,
        });
      }),
      catchError(this.handleError)
    );
  }

  updateUser(user: User): Observable<User> {
    this.userStateService.setIsLoading(true);
    return this.userApiService.update(user).pipe(
      tap(updatedUser => {
        this.userStateService.setUser(updatedUser);
        this.userStateService.setIsLoading(false);
        this.snackBar.open(
          'Your information has been successfully updated!',
          'Dismiss',
          { duration: 5000 }
        );
      }),
      catchError(this.handleError)
    );
  }

  deleteUser(user: User): Observable<any> {
    this.userStateService.setIsLoading(true);
    return this.userApiService.delete(user).pipe(
      switchMap(() => {
        this.userStateService.setUser(null);
        this.userStateService.setIsLoading(false);
        this.snackBar.open(
          'Your account has been successfully deleted!',
          'Dismiss',
          { duration: 5000 }
        );
        return of(undefined);
      }),
      catchError(this.handleError)
    );
  }

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.userStateService.setIsLoading(false);
    return of(null);
  };
}
