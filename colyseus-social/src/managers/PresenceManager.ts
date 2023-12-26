import { Inbox } from '../rooms/Inbox';
import { User } from '../schemas/User';
import { Activity } from '../types/activity/activity.type';
import { GameMap } from '../types/game-map/game-map.type';
import { GameMode } from '../types/game-mode/game-mode.type.';
import { GameType } from '../types/game-type/game-type.type';
import { Presence } from '../types/presence/presence.type';
import { QueueType } from '../types/queue-type/queue-type.type';
import { InboxManager } from './InboxManager';

export class PresenceManager extends InboxManager {
  constructor(inbox: Inbox) {
    super(inbox);
    this.setOnMessageListeners();
  }

  notifyHostUserActivity(user: User, activity?: Activity) {
    this.inbox.hostClient.send('activity', {
      id: user._id,
      activity: activity ? activity : user.activity,
    });
  }

  notifyHostUserQueueType(user: User, queueType?: QueueType) {
    this.inbox.hostClient.send('queueType', {
      id: user._id,
      queueType: queueType ? queueType : user.queueType,
    });
  }

  notifyHostUserGameType(user: User, gameType?: GameType) {
    this.inbox.hostClient.send('gameType', {
      id: user._id,
      gameType: gameType ? gameType : user.gameType,
    });
  }

  notifyHostUserGameMode(user: User, gameMode?: GameMode) {
    this.inbox.hostClient.send('gameMode', {
      id: user._id,
      gameMode: gameMode ? gameMode : user.gameMode,
    });
  }

  notifyHostUserGameMap(user: User, gameMap?: GameMap) {
    this.inbox.hostClient.send('gameMap', {
      id: user._id,
      gameMap: gameMap ? gameMap : user.gameMap,
    });
  }

  notifyHostUserPresence(user: User, presence?: Presence) {
    this.inbox.hostClient.send('presence', {
      id: user._id,
      presence: presence ? presence : user.presence,
    });
  }

  broadcastDisposeRoom() {
    this.inbox.broadcast('dispose', this.inbox.roomId, {
      except: this.inbox.hostClient,
    });
  }

  setOnMessageListeners() {
    this.inbox.onMessage('setHostActivity', (client, activity: Activity) => {
      this.inbox.state.host.activity = activity;
      this.inbox.broadcast(
        'activity',
        {
          id: this.inbox.state.host._id,
          activity: this.inbox.state.host.activity,
        },
        { except: this.inbox.hostClient }
      );
    });

    this.inbox.onMessage('setHostQueueType', (client, queueType: QueueType) => {
      this.inbox.state.host.queueType = queueType;
      this.inbox.broadcast(
        'queueType',
        {
          id: this.inbox.state.host._id,
          queueType: this.inbox.state.host.queueType,
        },
        { except: this.inbox.hostClient }
      );
    });

    this.inbox.onMessage('setHostGameType', (client, gameType: GameType) => {
      this.inbox.state.host.gameType = gameType;
      this.inbox.broadcast(
        'gameType',
        {
          id: this.inbox.state.host._id,
          gameType: this.inbox.state.host.gameType,
        },
        { except: this.inbox.hostClient }
      );
    });

    this.inbox.onMessage('setHostGameMode', (client, gameMode: GameMode) => {
      this.inbox.state.host.gameMode = gameMode;
      this.inbox.broadcast(
        'gameMode',
        {
          id: this.inbox.state.host._id,
          gameMode: this.inbox.state.host.gameMode,
        },
        { except: this.inbox.hostClient }
      );
    });

    this.inbox.onMessage('setHostGameMap', (client, gameMap: GameMap) => {
      this.inbox.state.host.gameMap = gameMap;
      this.inbox.broadcast(
        'gameMap',
        {
          id: this.inbox.state.host._id,
          gameMap: this.inbox.state.host.gameMap,
        },
        { except: this.inbox.hostClient }
      );
    });

    this.inbox.onMessage('setHostPresence', (client, presence: Presence) => {
      this.inbox.state.host.presence = presence;
      this.inbox.broadcast(
        'presence',
        {
          id: this.inbox.state.host._id,
          presence: this.inbox.state.host.presence,
        },
        { except: this.inbox.hostClient }
      );
    });

    this.inbox.onMessage(
      'notifyHostActivity',
      (client, friend: { id: string; activity: Activity }) => {
        const user = this.inbox.getUserById(friend.id);
        user.activity = friend.activity;
        this.notifyHostUserActivity(user);
      }
    );

    this.inbox.onMessage(
      'notifyHostQueueType',
      (client, friend: { id: string; queueType: QueueType }) => {
        const user = this.inbox.getUserById(friend.id);
        user.queueType = friend.queueType;
        this.notifyHostUserQueueType(user);
      }
    );

    this.inbox.onMessage(
      'notifyHostGameType',
      (client, friend: { id: string; gameType: GameType }) => {
        const user = this.inbox.getUserById(friend.id);
        user.gameType = friend.gameType;
        this.notifyHostUserGameType(user);
      }
    );

    this.inbox.onMessage(
      'notifyHostGameMode',
      (client, friend: { id: string; gameMode: GameMode }) => {
        const user = this.inbox.getUserById(friend.id);
        user.gameMode = friend.gameMode;
        this.notifyHostUserGameMode(user);
      }
    );

    this.inbox.onMessage(
      'notifyHostGameMap',
      (client, friend: { id: string; gameMap: GameMap }) => {
        const user = this.inbox.getUserById(friend.id);
        user.gameMap = friend.gameMap;
        this.notifyHostUserGameMap(user);
      }
    );

    this.inbox.onMessage(
      'notifyHostPresence',
      (client, friend: { id: string; presence: Presence }) => {
        const user = this.inbox.getUserById(friend.id);
        user.presence = friend.presence;
        this.notifyHostUserPresence(user);
      }
    );
  }
}
