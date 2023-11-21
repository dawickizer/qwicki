import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invite } from './invite.model';
import { InviteEffectService } from './invite.effect.service';
import { InviteStateService } from './invite.state.service';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root',
})
export class InviteService {
  get inviteState$() {
    return this.inviteStateService.inviteState$;
  }

  get isLoading$(): Observable<boolean> {
    return this.inviteStateService.isLoading$;
  }

  get inboundInvites$(): Observable<Invite[]> {
    return this.inviteStateService.inboundInvites$;
  }

  get outboundInvites$(): Observable<Invite[]> {
    return this.inviteStateService.outboundInvites$;
  }

  get inboundPartyInvites(): Observable<Invite[]> {
    return this.inviteStateService.inboundPartyInvites$;
  }

  get outboundPartyInvites$(): Observable<Invite[]> {
    return this.inviteStateService.outboundPartyInvites$;
  }

  constructor(
    private inviteEffectService: InviteEffectService,
    private inviteStateService: InviteStateService
  ) {}

  sendInvite(user: User, invite: Invite): Observable<Invite> {
    return this.inviteEffectService.sendInvite(user, invite);
  }

  acceptInvite(user: User, invite: Invite): Observable<Invite> {
    return this.inviteEffectService.acceptInvite(user, invite);
  }

  revokeInvite(user: User, invite: Invite): Observable<Invite> {
    return this.inviteEffectService.revokeInvite(user, invite);
  }

  rejectInvite(user: User, invite: Invite): Observable<Invite> {
    return this.inviteEffectService.rejectInvite(user, invite);
  }

  receiveInvite(invite: Invite): Observable<Invite> {
    return this.inviteEffectService.receiveInvite(invite);
  }

  setInitialState(): void {
    this.inviteStateService.setInitialState();
  }

  setInboundInvites(inboundInvites: Invite[]): void {
    this.inviteStateService.setInboundInvites(inboundInvites);
  }

  addInboundInvite(invite: Invite): void {
    this.inviteStateService.addInboundInvite(invite);
  }

  removeInboundInvite(invite: Invite): void {
    this.inviteStateService.removeInboundInvite(invite);
  }

  setOutboundInvites(outboundInvites: Invite[]): void {
    this.inviteStateService.setOutboundInvites(outboundInvites);
  }

  addOutboundInvite(invite: Invite): void {
    this.inviteStateService.addOutboundInvite(invite);
  }

  removeOutboundInvite(invite: Invite): void {
    this.inviteStateService.removeOutboundInvite(invite);
  }

  setIsLoading(isLoading: boolean): void {
    this.inviteStateService.setIsLoading(isLoading);
  }
}
