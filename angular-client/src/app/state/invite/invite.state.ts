import { Invite } from './invite.model';

export interface InviteState {
  inboundInvites: Invite[] | null;
  outboundInvites: Invite[] | null;
  isLoading: boolean;
}

export const initialState: InviteState = {
  inboundInvites: [],
  outboundInvites: [],
  isLoading: false,
};
