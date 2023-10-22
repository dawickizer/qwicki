import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InboxState, initialState } from './inbox.state';
import {
  connectedInboxesSelector,
  isLoadingSelector,
  friendsInboxesSelector,
  personalInboxSelector,
} from './inbox.state.selector';
import { Room } from 'colyseus.js';

@Injectable({
  providedIn: 'root',
})
export class InboxStateService {
  private _inboxState = new BehaviorSubject<InboxState>(initialState);

  public inboxState$: Observable<InboxState> = this._inboxState.asObservable();
  public isLoading$ = isLoadingSelector(this.inboxState$);
  public personalInbox$ = personalInboxSelector(this.inboxState$);
  public connectedInboxes$ = connectedInboxesSelector(this.inboxState$);
  public friendsInboxes$ = friendsInboxesSelector(this.inboxState$);

  setInitialState() {
    this._inboxState.next(initialState);
  }

  setPersonalInbox(personalInbox: Room): void {
    const currentState = this._inboxState.value;
    this._inboxState.next({ ...currentState, personalInbox });
  }

  addConnectedInbox(inbox: Room): void {
    const currentState = this._inboxState.value;
    const updatedConnectedInboxes = [...currentState.connectedInboxes, inbox];
    this._inboxState.next({
      ...currentState,
      connectedInboxes: updatedConnectedInboxes,
    });
  }

  addConnectedInboxes(inboxes: Room[]): void {
    const currentState = this._inboxState.value;
    const updatedConnectedInboxes = [
      ...currentState.connectedInboxes,
      ...inboxes,
    ];
    this._inboxState.next({
      ...currentState,
      connectedInboxes: updatedConnectedInboxes,
    });
  }

  removeConnectedInboxById(inboxId: string): void {
    const currentState = this._inboxState.value;
    const updatedConnectedInboxes = currentState.connectedInboxes.filter(
      r => r.id !== inboxId
    );
    this._inboxState.next({
      ...currentState,
      connectedInboxes: updatedConnectedInboxes,
    });
  }

  removeConnectedInbox(inbox: Room): void {
    const currentState = this._inboxState.value;
    const updatedConnectedInboxes = currentState.connectedInboxes.filter(
      r => r.id !== inbox.id
    );
    this._inboxState.next({
      ...currentState,
      connectedInboxes: updatedConnectedInboxes,
    });
  }

  removeConnectedInboxes(inboxesToRemove: Room[]): void {
    const currentState = this._inboxState.value;
    const inboxIdsToRemove = inboxesToRemove.map(inbox => inbox.id);
    const updatedConnectedInboxes = currentState.connectedInboxes.filter(
      inbox => !inboxIdsToRemove.includes(inbox.id)
    );
    this._inboxState.next({
      ...currentState,
      connectedInboxes: updatedConnectedInboxes,
    });
  }

  updateConnectedInbox(updatedInbox: Room): void {
    const currentState = this._inboxState.value;
    const updatedConnectedInboxes = currentState.connectedInboxes.map(inbox =>
      inbox.id === updatedInbox.id ? updatedInbox : inbox
    );
    this._inboxState.next({
      ...currentState,
      connectedInboxes: updatedConnectedInboxes,
    });
  }

  updateConnectedInboxes(updatedInboxes: Room[]): void {
    const currentState = this._inboxState.value;
    const updatedConnectedInboxes = currentState.connectedInboxes.map(inbox => {
      const foundUpdatedInbox = updatedInboxes.find(
        updated => updated.id === inbox.id
      );
      return foundUpdatedInbox ? foundUpdatedInbox : inbox;
    });
    this._inboxState.next({
      ...currentState,
      connectedInboxes: updatedConnectedInboxes,
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._inboxState.value;
    this._inboxState.next({ ...currentState, isLoading });
  }
}
