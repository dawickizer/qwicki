import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStateService } from './user.state.service';
import { User } from './user.model';
import { UserEffectsService } from './user.effects.service';

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
    private userEffectsService: UserEffectsService,
    private userStateService: UserStateService
  ) {}

  getUser(
    id: string,
    options?: { friends?: boolean; friendRequests?: boolean }
  ): Observable<User> {
    return this.userEffectsService.getUser(id, options);
  }

  updateUser(user: User): Observable<User> {
    return this.userEffectsService.updateUser(user);
  }

  deleteUser(user: User): Observable<any> {
    return this.userEffectsService.deleteUser(user);
  }

  // These methods might not be necessary to expose,
  // but I've kept them in case you want components to directly manipulate state without side-effects.
  // It's advisable to limit the exposure of direct state manipulation methods.
  setUser(user: User): void {
    this.userStateService.setUser(user);
  }

  setOnline(online: boolean): void {
    this.userStateService.setOnline(online);
  }

  setIsLoading(isLoading: boolean): void {
    this.userStateService.setIsLoading(isLoading);
  }

  // You can also add additional convenience methods here, if required.
}
