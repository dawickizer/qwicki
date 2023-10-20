import { Injectable } from '@angular/core';
import { InboxStateService } from './inbox.state.service';
import { InboxEffectService } from './inbox.effect.service';
import { Room } from 'colyseus.js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InboxServiceService {
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

  setIsLoading(isLoading: boolean): void {
    this.inboxStateService.setIsLoading(isLoading);
  }
}
