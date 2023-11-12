import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { InviteState } from './invite.state';
import { isEqual } from 'lodash';
import { Invite } from './invite.model';

export const isLoadingSelector = (
  inviteState$: Observable<InviteState>
): Observable<boolean> =>
  inviteState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged(isEqual)
  );

export const inboundInvitesSelector = (
  inviteState$: Observable<InviteState>
): Observable<Invite[] | null> =>
  inviteState$.pipe(
    map(state => state.inboundInvites),
    distinctUntilChanged(isEqual)
  );

export const outboundInvitesSelector = (
  inviteState$: Observable<InviteState>
): Observable<Invite[] | null> =>
  inviteState$.pipe(
    map(state => state.outboundInvites),
    distinctUntilChanged(isEqual)
  );

export const partyInvitesSelector = (
  invites$: Observable<Invite[] | null>
): Observable<Invite[] | null> =>
  invites$.pipe(
    map(invites => invites.filter(invite => invite.type === 'party')),
    distinctUntilChanged(isEqual)
  );
