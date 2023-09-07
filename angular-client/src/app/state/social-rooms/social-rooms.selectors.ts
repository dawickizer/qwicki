import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { SocialRoomsState } from './social-rooms.state';
import { Room } from 'colyseus.js';

export const isLoadingSelector = (
  socialRoomsState$: Observable<SocialRoomsState>
): Observable<boolean> =>
  socialRoomsState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged()
  );

export const personalRoomSelector = (
  socialRoomsState$: Observable<SocialRoomsState>
): Observable<Room> =>
  socialRoomsState$.pipe(
    map(state => state.personalRoom),
    distinctUntilChanged()
  );

export const connectedRoomsSelector = (
  socialRoomsState$: Observable<SocialRoomsState>
): Observable<Room[]> =>
  socialRoomsState$.pipe(
    map(state => state.connectedRooms),
    distinctUntilChanged()
  );
