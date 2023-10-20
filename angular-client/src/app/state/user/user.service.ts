import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStateService } from './user.state.service';
import { User } from './user.model';
import { UserEffectService } from './user.effect.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Directly exposing some state observables from UserStateService
  get isLoading$(): Observable<boolean> {
    return this.userStateService.isLoading$;
  }

  get user$(): Observable<User | null> {
    return this.userStateService.user$;
  }

  get online$(): Observable<boolean | null> {
    return this.userStateService.online$;
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

  setOnline(online: boolean): void {
    this.userStateService.setOnline(online);
  }

  setIsLoading(isLoading: boolean): void {
    this.userStateService.setIsLoading(isLoading);
  }
}
