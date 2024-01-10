import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { GameState } from './game.state';
import { isEqual } from 'lodash';
import { Game } from './game.model';
import { Invite } from '../invite/invite.model';
import { Activity } from 'src/app/types/activity/activity.type';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { Player } from './player.model';
import { GameMessage } from './game-message.model';
import { MaxPlayerCount } from 'src/app/types/max-player-count/max-player-count.type';
import { Visibility } from 'src/app/types/visibility/visibility.type';
import { GameMap } from 'src/app/types/game-map/game-map.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { Team } from './team.model';
import { TeamName } from 'src/app/types/team-name/team-name.type';

export const gameSelector = (
  gameState$: Observable<GameState>
): Observable<Game> =>
  gameState$.pipe(
    map(state => state.game),
    distinctUntilChanged(isEqual)
  );

export const isLoadingSelector = (
  gameState$: Observable<GameState>
): Observable<boolean> =>
  gameState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged()
  );

export const routeSelector = (
  game$: Observable<Game | null>
): Observable<string | null> =>
  game$.pipe(
    map(game => (game ? game.route : null)),
    distinctUntilChanged(isEqual)
  );

export const activitySelector = (
  status$: Observable<Game | null>
): Observable<Activity | null> =>
  status$.pipe(
    map(game => (game ? game.activity : null)),
    distinctUntilChanged()
  );

export const gameTypeSelector = (
  status$: Observable<Game | null>
): Observable<GameType | null> =>
  status$.pipe(
    map(game => (game ? game.gameType : null)),
    distinctUntilChanged()
  );

export const gameModeSelector = (
  game$: Observable<Game | null>
): Observable<GameMode | null> =>
  game$.pipe(
    map(game => (game ? game.gameMode : null)),
    distinctUntilChanged(isEqual)
  );

export const gameMapSelector = (
  game$: Observable<Game | null>
): Observable<GameMap | null> =>
  game$.pipe(
    map(game => (game ? game.gameMap : null)),
    distinctUntilChanged(isEqual)
  );

export const visibilitySelector = (
  game$: Observable<Game | null>
): Observable<Visibility | null> =>
  game$.pipe(
    map(game => (game ? game.visibility : null)),
    distinctUntilChanged(isEqual)
  );

export const maxPlayerCountSelector = (
  game$: Observable<Game | null>
): Observable<MaxPlayerCount | null> =>
  game$.pipe(
    map(game => (game ? game.maxPlayerCount : null)),
    distinctUntilChanged(isEqual)
  );

export const nameSelector = (
  game$: Observable<Game | null>
): Observable<string | null> =>
  game$.pipe(
    map(game => (game ? game.name : null)),
    distinctUntilChanged(isEqual)
  );

export const hostSelector = (
  game$: Observable<Game | null>
): Observable<Player | null> =>
  game$.pipe(
    map(game => (game ? game.host : null)),
    distinctUntilChanged(isEqual)
  );

export const playersSelector = (
  game$: Observable<Game | null>
): Observable<Map<string, Player> | null> =>
  game$.pipe(
    map(game => (game ? game.players : null)),
    distinctUntilChanged(isEqual)
  );

export const messagesSelector = (
  game$: Observable<Game | null>
): Observable<GameMessage[] | null> =>
  game$.pipe(
    map(game => (game ? game.messages : null)),
    distinctUntilChanged(isEqual)
  );

export const outboundInvitesSelector = (
  game$: Observable<Game | null>
): Observable<Invite[] | null> =>
  game$.pipe(
    map(game => (game ? game.outboundInvites : null)),
    distinctUntilChanged(isEqual)
  );

export const teamsSelector = (
  game$: Observable<Game | null>
): Observable<Map<TeamName, Team> | null> =>
  game$.pipe(
    map(game => (game ? game.teams : null)),
    distinctUntilChanged(isEqual)
  );

export const teamByIdSelector = (
  teams$: Observable<Map<string, Team> | null>,
  id: string
): Observable<Team | null> =>
  teams$.pipe(
    map(teams => {
      if (teams) {
        return teams.get(id);
      }
      return null;
    }),
    distinctUntilChanged(isEqual)
  );
