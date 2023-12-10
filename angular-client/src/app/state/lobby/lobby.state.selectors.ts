import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { LobbyState } from './lobby.state';
import { isEqual } from 'lodash';
import { Lobby } from './lobby.model';
import {
  Activity,
  GameType,
  Presence,
  QueueType,
  Status,
} from 'src/app/models/status/status.model';
import { Message } from '../message/message.model';
import { Member } from 'src/app/models/member/member';
import { Invite } from '../invite/invite.model';

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

export const statusSelector = (
  lobby$: Observable<Lobby | null>
): Observable<Status | null> =>
  lobby$.pipe(
    map(lobby => (lobby ? lobby.status : null)),
    distinctUntilChanged()
  );

export const presenceSelector = (
  status$: Observable<Status | null>
): Observable<Presence | null> =>
  status$.pipe(
    map(status => (status ? status.presence : null)),
    distinctUntilChanged()
  );

export const activitySelector = (
  status$: Observable<Status | null>
): Observable<Activity | null> =>
  status$.pipe(
    map(status => (status ? status.activity : null)),
    distinctUntilChanged()
  );

export const queueTypeSelector = (
  status$: Observable<Status | null>
): Observable<QueueType | null> =>
  status$.pipe(
    map(status => (status ? status.queueType : null)),
    distinctUntilChanged()
  );

export const gameTypeSelector = (
  status$: Observable<Status | null>
): Observable<GameType | null> =>
  status$.pipe(
    map(status => (status ? status.gameType : null)),
    distinctUntilChanged()
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

export const messagesSelector = (
  lobby$: Observable<Lobby | null>
): Observable<Message[] | null> =>
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
