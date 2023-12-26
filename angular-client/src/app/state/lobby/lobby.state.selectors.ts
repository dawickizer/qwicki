import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { LobbyState } from './lobby.state';
import { isEqual } from 'lodash';
import { Lobby } from './lobby.model';
import { Member } from 'src/app/state/lobby/member.model';
import { Invite } from '../invite/invite.model';
import { LobbyMessage } from './lobby-message.model';
import { Activity } from 'src/app/types/activity/activity.type';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameMap } from 'src/app/types/game-map/game-map.type';

export const lobbySelector = (
  lobbyState$: Observable<LobbyState>
): Observable<Lobby> =>
  lobbyState$.pipe(
    map(state => state.lobby),
    distinctUntilChanged(isEqual)
  );

export const isLoadingSelector = (
  lobbyState$: Observable<LobbyState>
): Observable<boolean> =>
  lobbyState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged()
  );

export const isReadySelector = (
  lobby$: Observable<Lobby | null>
): Observable<boolean | null> =>
  lobby$.pipe(
    map(lobby => (lobby ? lobby.isReady : null)),
    distinctUntilChanged(isEqual)
  );

export const routeSelector = (
  lobby$: Observable<Lobby | null>
): Observable<string | null> =>
  lobby$.pipe(
    map(lobby => (lobby ? lobby.route : null)),
    distinctUntilChanged(isEqual)
  );

export const activitySelector = (
  lobby$: Observable<Lobby | null>
): Observable<Activity | null> =>
  lobby$.pipe(
    map(lobby => (lobby ? lobby.activity : null)),
    distinctUntilChanged(isEqual)
  );

export const queueTypeSelector = (
  lobby$: Observable<Lobby | null>
): Observable<QueueType | null> =>
  lobby$.pipe(
    map(lobby => (lobby ? lobby.queueType : null)),
    distinctUntilChanged(isEqual)
  );

export const gameTypeSelector = (
  lobby$: Observable<Lobby | null>
): Observable<GameType | null> =>
  lobby$.pipe(
    map(lobby => (lobby ? lobby.gameType : null)),
    distinctUntilChanged(isEqual)
  );

export const gameModeSelector = (
  lobby$: Observable<Lobby | null>
): Observable<GameMode | null> =>
  lobby$.pipe(
    map(lobby => (lobby ? lobby.gameMode : null)),
    distinctUntilChanged(isEqual)
  );

export const gameMapSelector = (
  lobby$: Observable<Lobby | null>
): Observable<GameMap | null> =>
  lobby$.pipe(
    map(lobby => (lobby ? lobby.gameMap : null)),
    distinctUntilChanged(isEqual)
  );

export const hostSelector = (
  lobby$: Observable<Lobby | null>
): Observable<Member | null> =>
  lobby$.pipe(
    map(lobby => (lobby ? lobby.host : null)),
    distinctUntilChanged(isEqual)
  );

export const membersSelector = (
  lobby$: Observable<Lobby | null>
): Observable<Map<string, Member> | null> =>
  lobby$.pipe(
    map(lobby => (lobby ? lobby.members : null)),
    distinctUntilChanged(isEqual)
  );

export const isReadyByMemberSessionIdSelector = (
  members$: Observable<Map<string, Member> | null>,
  sessionId: string
): Observable<boolean> =>
  members$.pipe(
    map(members => members?.get(sessionId)?.isReady),
    distinctUntilChanged(isEqual)
  );

export const messagesSelector = (
  lobby$: Observable<Lobby | null>
): Observable<LobbyMessage[] | null> =>
  lobby$.pipe(
    map(lobby => (lobby ? lobby.messages : null)),
    distinctUntilChanged(isEqual)
  );

export const outboundInvitesSelector = (
  lobby$: Observable<Lobby | null>
): Observable<Invite[] | null> =>
  lobby$.pipe(
    map(lobby => (lobby ? lobby.outboundInvites : null)),
    distinctUntilChanged(isEqual)
  );
