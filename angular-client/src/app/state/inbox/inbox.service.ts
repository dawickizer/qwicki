import { Injectable } from '@angular/core';
import { InboxStateService } from './inbox.state.service';
import { InboxEffectService } from './inbox.effect.service';
import { Room } from 'colyseus.js';
import { Observable } from 'rxjs';

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

  createInbox(inboxId: string, jwt: string): Observable<Room<any>> {
    return this.inboxEffectService.createInbox(inboxId, jwt);
  }

  joinExistingInboxesIfPresent(
    inboxIds: string[],
    jwt: string
  ): Observable<Room<any>[]> {
    return this.inboxEffectService.joinExistingInboxesIfPresent(inboxIds, jwt);
  }

  joinExistingInboxIfPresent(
    inboxId: string,
    jwt: string
  ): Observable<Room<any>> {
    return this.inboxEffectService.joinExistingInboxIfPresent(inboxId, jwt);
  }

  leaveInboxes(inboxes: Room[]): Observable<number[]> {
    return this.inboxEffectService.leaveInboxes(inboxes);
  }

  leaveInbox(inbox: Room): Observable<number> {
    return this.inboxEffectService.leaveInbox(inbox);
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
