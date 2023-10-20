import * as Colyseus from 'colyseus.js';

export interface InboxState {
  personalInbox: Colyseus.Room | null;
  connectedInboxes: Colyseus.Room[];
  isLoading: boolean;
}

export const initialState: InboxState = {
  personalInbox: null,
  connectedInboxes: [],
  isLoading: false,
};
