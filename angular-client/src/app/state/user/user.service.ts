import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStateService } from './user.state.service';
import { User } from './user.model';
import { UserEffectService } from './user.effect.service';
import { OnlineStatus } from 'src/app/models/online-status/online-status';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  get userState$() {
    return this.userStateService.userState$;
  }

  get isLoading$(): Observable<boolean> {
    return this.userStateService.isLoading$;
  }

  get user$(): Observable<User | null> {
    return this.userStateService.user$;
  }

  get onlineStatus$(): Observable<OnlineStatus | null> {
    return this.userStateService.onlineStatus$;
  }

  constructor(
    private userEffectService: UserEffectService,
    private userStateService: UserStateService
  ) {}

  getUser(
    id: string,
    options?: { friends?: boolean; friendRequests?: boolean }
  ): Observable<User> {
    return this.userEffectService.getUser(id, options);
  }

  updateUser(user: User): Observable<User> {
    return this.userEffectService.updateUser(user);
  }

  deleteUser(user: User): Observable<any> {
    return this.userEffectService.deleteUser(user);
  }

  setInitialState(): void {
    this.userStateService.setInitialState();
  }

  setUser(user: User): void {
    this.userStateService.setUser(user);
  }

  setOnlineStatus(onlineStatus: OnlineStatus): void {
    this.userStateService.setOnlineStatus(onlineStatus);
  }

  setIsLoading(isLoading: boolean): void {
    this.userStateService.setIsLoading(isLoading);
  }
}
