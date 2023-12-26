import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { UserState } from './user.state';
import { isEqual } from 'lodash';
import { User } from './user.model';
import { Presence } from 'src/app/types/presence/presence.type';
import { Activity } from 'src/app/types/activity/activity.type';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap } from 'src/app/types/game-map/game-map.type';

export const userSelector = (
  userState$: Observable<UserState>
): Observable<User> =>
  userState$.pipe(
    map(state => state.user),
    distinctUntilChanged(isEqual)
  );

export const isLoadingSelector = (
  userState$: Observable<UserState>
): Observable<boolean> =>
  userState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged()
  );

export const presenceSelector = (
  user$: Observable<User | null>
): Observable<Presence | null> =>
  user$.pipe(
    map(user => (user ? user.presence : null)),
    distinctUntilChanged()
  );

export const activitySelector = (
  user$: Observable<User | null>
): Observable<Activity | null> =>
  user$.pipe(
    map(user => (user ? user.activity : null)),
    distinctUntilChanged()
  );

export const queueTypeSelector = (
  user$: Observable<User | null>
): Observable<QueueType | null> =>
  user$.pipe(
    map(user => (user ? user.queueType : null)),
    distinctUntilChanged()
  );

export const gameTypeSelector = (
  user$: Observable<User | null>
): Observable<GameType | null> =>
  user$.pipe(
    map(user => (user ? user.gameType : null)),
    distinctUntilChanged()
  );

export const gameModeSelector = (
  user$: Observable<User | null>
): Observable<GameMode | null> =>
  user$.pipe(
    map(user => (user ? user.gameMode : null)),
    distinctUntilChanged()
  );

export const gameMapSelector = (
  user$: Observable<User | null>
): Observable<GameMap | null> =>
  user$.pipe(
    map(user => (user ? user.gameMap : null)),
    distinctUntilChanged()
  );
