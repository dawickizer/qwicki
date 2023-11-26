import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InviteState, initialState } from './invite.state';
import {
  isLoadingSelector,
  inboundInvitesSelector,
  outboundInvitesSelector,
  partyInvitesSelector,
} from './invite.state.selectors';
import { Invite } from './invite.model';
import { Friend } from '../friend/friend.model';

@Injectable({
  providedIn: 'root',
})
export class InviteStateService {
  private _inviteState = new BehaviorSubject<InviteState>(initialState);

  public inviteState$: Observable<InviteState> =
    this._inviteState.asObservable();
  public isLoading$ = isLoadingSelector(this.inviteState$);
  public inboundInvites$ = inboundInvitesSelector(this.inviteState$);
  public outboundInvites$ = outboundInvitesSelector(this.inviteState$);
  public inboundPartyInvites$ = partyInvitesSelector(this.inboundInvites$);
  public outboundPartyInvites$ = partyInvitesSelector(this.outboundInvites$);

  setInitialState() {
    this._inviteState.next(initialState);
  }

  setInboundInvites(inboundInvites: Invite[]) {
    const currentState = this._inviteState.value;
    if (!currentState.inboundInvites) return;

    this._inviteState.next({
      ...currentState,
      inboundInvites: [...inboundInvites].map(
        inboundInvite => new Invite(inboundInvite)
      ),
    });
  }

  addInboundInvite(invite: Invite): void {
    const currentState = this._inviteState.value;
    if (!currentState.inboundInvites) return;

    const updatedInboundInvites = [...currentState.inboundInvites, invite];
    this._inviteState.next({
      ...currentState,
      inboundInvites: updatedInboundInvites,
    });
  }

  removeInboundInvite(invite: Invite): void {
    const currentState = this._inviteState.value;
    if (!currentState.inboundInvites) return;

    const updatedInboundInvites = currentState.inboundInvites.filter(
      inboundInvite => inboundInvite._id !== invite._id
    );

    this._inviteState.next({
      ...currentState,
      inboundInvites: updatedInboundInvites,
    });
  }

  setOutboundInvites(outboundInvites: Invite[]) {
    const currentState = this._inviteState.value;
    if (!currentState.outboundInvites) return;

    this._inviteState.next({
      ...currentState,
      outboundInvites: [...outboundInvites].map(
        outboundInvite => new Invite(outboundInvite)
      ),
    });
  }

  addOutboundInvite(invite: Invite): void {
    const currentState = this._inviteState.value;
    if (!currentState.outboundInvites) return;

    const updatedOutboundInvites = [...currentState.outboundInvites, invite];
    this._inviteState.next({
      ...currentState,
      outboundInvites: updatedOutboundInvites,
    });
  }

  removeOutboundInvite(invite: Invite): void {
    const currentState = this._inviteState.value;
    if (!currentState.outboundInvites) return;

    const updatedOutboundInvites = currentState.outboundInvites.filter(
      outboundInvite => outboundInvite._id !== invite._id
    );

    this._inviteState.next({
      ...currentState,
      outboundInvites: updatedOutboundInvites,
    });
  }

  removeInvitesFromFriend(friend: Friend): void {
    const currentState = this._inviteState.value;

    // Check if we have any invites in the state to begin with
    if (!currentState.inboundInvites || !currentState.outboundInvites) return;

    // Filter out inbound invites where the friend's ID matches the from ID of the invite
    const updatedInboundInvites = currentState.inboundInvites.filter(
      inboundInvite => inboundInvite.from._id !== friend._id
    );

    // Filter out outbound invites where the friend's ID matches the to ID of the invite
    const updatedOutboundInvites = currentState.outboundInvites.filter(
      outboundInvite => outboundInvite.to._id !== friend._id
    );

    // Update the state with the new arrays
    this._inviteState.next({
      ...currentState,
      inboundInvites: updatedInboundInvites,
      outboundInvites: updatedOutboundInvites,
    });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._inviteState.value;
    this._inviteState.next({ ...currentState, isLoading });
  }
}
