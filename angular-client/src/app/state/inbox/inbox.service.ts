import { Injectable } from '@angular/core';
import { InboxStateService } from './inbox.state.service';
import { InboxEffectService } from './inbox.effect.service';
import { Room } from 'colyseus.js';
import { Observable } from 'rxjs';
import { DecodedJwt } from '../auth/decoded-jwt.model';
import { Presence } from 'src/app/types/presence/presence.type';
import { Activity } from 'src/app/types/activity/activity.type';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap } from 'src/app/types/game-map/game-map.type';

@Injectable({
  providedIn: 'root',
})
export class InboxService {
  get inboxState$() {
    return this.inboxStateService.inboxState$;
  }

  get isLoading$(): Observable<boolean> {
    return this.inboxStateService.isLoading$;
  }

  get personalInbox$(): Observable<Room | null> {
    return this.inboxStateService.personalInbox$;
  }

  get connectedInboxes$(): Observable<Room[]> {
    return this.inboxStateService.connectedInboxes$;
  }

  get friendsInboxes$(): Observable<Room[]> {
    return this.inboxStateService.friendsInboxes$;
  }

  constructor(
    private inboxStateService: InboxStateService,
    private inboxEffectService: InboxEffectService
  ) {}

  createInbox(
    inboxId: string,
    options: {
      jwt: string;
      presence: Presence;
      activity: Activity;
      queueType: QueueType;
      gameType: GameType;
      gameMode: GameMode;
      gameMap: GameMap;
    }
  ): Observable<Room<any>> {
    return this.inboxEffectService.createInbox(inboxId, options);
  }

  joinExistingInboxesIfPresent(
    inboxIds: string[],
    options: {
      jwt: string;
      presence: Presence;
      activity: Activity;
      queueType: QueueType;
      gameType: GameType;
      gameMode: GameMode;
      gameMap: GameMap;
    }
  ): Observable<Room<any>[]> {
    return this.inboxEffectService.joinExistingInboxesIfPresent(
      inboxIds,
      options
    );
  }

  joinExistingInboxIfPresent(
    inboxId: string,
    options: {
      jwt: string;
      presence: Presence;
      activity: Activity;
      queueType: QueueType;
      gameType: GameType;
      gameMode: GameMode;
      gameMap: GameMap;
    }
  ): Observable<Room<any>> {
    return this.inboxEffectService.joinExistingInboxIfPresent(inboxId, options);
  }

  leaveInboxes(inboxes: Room[], decodedJwt: DecodedJwt): Observable<number[]> {
    return this.inboxEffectService.leaveInboxes(inboxes, decodedJwt);
  }

  leaveInbox(inbox: Room, decodedJwt: DecodedJwt): Observable<number> {
    return this.inboxEffectService.leaveInbox(inbox, decodedJwt);
  }

  setInitialState(): void {
    this.inboxStateService.setInitialState();
  }

  setPersonalInbox(personalInbox: Room): void {
    this.inboxStateService.setPersonalInbox(personalInbox);
  }

  addConnectedInbox(inbox: Room): void {
    this.inboxStateService.addConnectedInbox(inbox);
  }

  addConnectedInboxes(inboxes: Room[]): void {
    this.inboxStateService.addConnectedInboxes(inboxes);
  }

  removeConnectedInboxById(inboxId: string): void {
    this.inboxStateService.removeConnectedInboxById(inboxId);
  }

  removeConnectedInbox(inbox: Room): void {
    this.inboxStateService.removeConnectedInbox(inbox);
  }

  removeConnectedInboxes(inboxesToRemove: Room[]): void {
    this.inboxStateService.removeConnectedInboxes(inboxesToRemove);
  }

  updateConnectedInbox(updatedInbox: Room): void {
    this.inboxStateService.updateConnectedInbox(updatedInbox);
  }

  updateConnectedInboxes(updatedInboxes: Room[]): void {
    this.inboxStateService.updateConnectedInboxes(updatedInboxes);
  }

  setIsLoading(isLoading: boolean): void {
    this.inboxStateService.setIsLoading(isLoading);
  }
}
