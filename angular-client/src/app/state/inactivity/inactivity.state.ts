import { OnlineStatus } from 'src/app/models/online-status/online-status';

export interface InactivityState {
  isInactive: boolean;
  isTimedOut: boolean;
  isAway: boolean;
  onlineStatus: OnlineStatus;
}

export const initialOfflineState: InactivityState = {
  isInactive: false,
  isTimedOut: false,
  isAway: false,
  onlineStatus: 'offline',
};

export const initialOnlineState: InactivityState = {
  isInactive: false,
  isTimedOut: false,
  isAway: false,
  onlineStatus: 'online',
};
