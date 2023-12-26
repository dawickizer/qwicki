import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStateService } from './user.state.service';
import { User } from './user.model';
import { UserEffectService } from './user.effect.service';
import { Presence } from 'src/app/types/presence/presence.type';
import { Activity } from 'src/app/types/activity/activity.type';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap } from 'src/app/types/game-map/game-map.type';

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

  get gameMode$(): Observable<GameMode | null> {
    return this.userStateService.gameMode$;
  }

  get gameMap$(): Observable<GameMap | null> {
    return this.userStateService.gameMap$;
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

  setPresence(presence: Presence): void {
    this.userStateService.setPresence(presence);
  }

  setActivity(activity: Activity): void {
    this.userStateService.setActivity(activity);
  }

  setQueueType(queueType: QueueType): void {
    this.userStateService.setQueueType(queueType);
  }

  setGameType(gameType: GameType): void {
    this.userStateService.setGameType(gameType);
  }

  setGameMode(gameMode: GameMode): void {
    this.userStateService.setGameMode(gameMode);
  }

  setGameMap(gameMap: GameMap): void {
    this.userStateService.setGameMap(gameMap);
  }

  setIsLoading(isLoading: boolean): void {
    this.userStateService.setIsLoading(isLoading);
  }
}
