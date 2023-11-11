import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InactivityStateService } from './inactivity.state.service';
import { InactivityEffectService } from './inactivity.effect.service';
import { InactivityState } from './inactivity.state';
import { OnlineStatus } from 'src/app/models/online-status/online-status';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  get inactivityState$(): Observable<InactivityState> {
    return this.inactivityStateService.inactivityState$;
  }

  get isAway$(): Observable<boolean> {
    return this.inactivityStateService.isAway$;
  }

  get isInactive$(): Observable<boolean> {
    return this.inactivityStateService.isInactive$;
  }

  get isTimedOut$(): Observable<boolean> {
    return this.inactivityStateService.isTimedOut$;
  }

  get onlineStatus$(): Observable<OnlineStatus> {
    return this.inactivityStateService.onlineStatus$;
  }

  constructor(
    private inactivityEffectService: InactivityEffectService,
    private inactivityStateService: InactivityStateService
  ) {}

  start(): void {
    this.inactivityEffectService.start();
  }

  stop(): void {
    this.inactivityEffectService.stop();
  }

  setInitialOfflineState(): void {
    this.inactivityStateService.setInitialOfflineState();
  }

  setInitialOnlineState(): void {
    this.inactivityStateService.setInitialOnlineState();
  }

  setIsAway(isAway: boolean) {
    this.inactivityStateService.setIsAway(isAway);
  }

  setIsInactive(isInactive: boolean) {
    this.inactivityStateService.setIsInactive(isInactive);
  }

  setIsTimedOut(isTimedOut: boolean) {
    this.inactivityStateService.setIsTimedOut(isTimedOut);
  }

  setOnlineStatus(onlineStatus: OnlineStatus) {
    this.inactivityStateService.setOnlineStatus(onlineStatus);
  }
}
