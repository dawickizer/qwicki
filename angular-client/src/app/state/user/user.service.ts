import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStateService } from './user.state.service';
import { User } from './user.model';
import { UserEffectService } from './user.effect.service';
import {
  Activity,
  GameType,
  Presence,
  QueueType,
  Status,
} from 'src/app/models/status/status.model';

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

  get status$(): Observable<Status | null> {
    return this.userStateService.status$;
  }

  get presence$(): Observable<Presence | null> {
    return this.userStateService.presence$;
  }

  get activity$(): Observable<Activity | null> {
    return this.userStateService.activity$;
  }

  get queueType$(): Observable<QueueType | null> {
    return this.userStateService.queueType$;
  }

  get gameType$(): Observable<GameType | null> {
    return this.userStateService.gameType$;
  }

  constructor(
    private userEffectService: UserEffectService,
    private userStateService: UserStateService
  ) {}

  getUser(
    id: string,
    options?: { friends?: boolean; friendRequests?: boolean; invites?: boolean }
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

  setStatus(status: Status): void {
    this.userStateService.setStatus(status);
  }

  updateStatus(status: Partial<Status>): void {
    this.userStateService.updateStatus(status);
  }

  setIsLoading(isLoading: boolean): void {
    this.userStateService.setIsLoading(isLoading);
  }
}
