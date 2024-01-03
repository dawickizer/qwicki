import { Schema, type, ArraySchema, MapSchema } from '@colyseus/schema';
import { Member } from '../member/Member';
import { Message } from '../message/Message';
import { Invite } from '../invite/Invite';
import { Client } from 'colyseus';
import { generateRandomUUID } from '../../utils/generateRandomUUID';
import { Activity } from '../../types/activity/activity.type';
import { QueueType } from '../../types/queue-type/queue-type.type';
import { GameType } from '../../types/game-type/game-type.type';
import { GameMode } from '../../types/game-mode/game-mode.type.';
import { GameMap } from '../../types/game-map/game-map.type';

export class LobbyState extends Schema {
  @type('string') _id: string;
  @type('string') route: string;
  @type('string') activity?: Activity;
  @type('string') queueType?: QueueType;
  @type('string') gameType?: GameType;
  @type('string') gameMode?: GameMode;
  @type('string') gameMap?: GameMap;
  @type(Member) host = new Member();
  @type({ map: Member }) members = new MapSchema<Member>();
  @type([Message]) messages = new ArraySchema<Message>();
  @type([Invite]) outboundInvites = new ArraySchema<Invite>();
  @type('boolean') isReady: boolean;

  chatBot: Member = new Member({
    _id: generateRandomUUID(),
    username: '',
    color: '#008080',
  });

  private availableColors = [
    '#007bff',
    '#BA55D3',
    '#FFD700',
    '#32CD32',
    '#C72929',
  ];
  private colorAssignments = new Map<string, string>();

  constructor(lobbyState?: Partial<LobbyState>) {
    super();
    this._id = lobbyState?._id ?? '';
    this.activity = lobbyState?.activity;
    this.queueType = lobbyState?.queueType;
    this.gameType = lobbyState?.gameType;
    this.gameMode = lobbyState?.gameMode;
    this.gameMap = lobbyState?.gameMap;
    this.host = new Member(lobbyState?.host) ?? new Member();
    this.members = lobbyState?.members
      ? new MapSchema<Member>(lobbyState?.members)
      : new MapSchema<Member>();
    this.messages = new ArraySchema<Message>(...(lobbyState?.messages ?? []));
    this.outboundInvites = new ArraySchema<Invite>(
      ...(lobbyState?.outboundInvites ?? [])
    );
    this.isReady = lobbyState.isReady;
  }

  addMember(member: Member) {
    this.members.set(member.sessionId, member);
    this.assignColor(member.sessionId);
    this.addMessage(
      new Message({
        _id: generateRandomUUID(),
        createdAt: new Date().getTime(),
        type: 'system-message',
        to: this._id,
        from: this.chatBot,
        content: `${member.username} joined`,
      })
    );
    this.determineIsReady();
    console.log(`${member.username} joined`);
    this.logMembers();
  }

  deleteMember(member: Member) {
    this.freeUpColor(member.sessionId);
    this.members.delete(member.sessionId);
    this.addMessage(
      new Message({
        _id: generateRandomUUID(),
        createdAt: new Date().getTime(),
        type: 'system-message',
        to: this._id,
        from: this.chatBot,
        content: `${member.username} left`,
      })
    );
    this.determineIsReady();
    console.log(`${member.username} left`);
    this.logMembers();
  }

  getMember(client: Client): Member {
    return this.members.get(client.sessionId);
  }

  getMemberById(id: string) {
    for (const member of this.members.values()) {
      if (member._id === id) {
        return member;
      }
    }
    return null;
  }

  logMembers() {
    console.log('Members in the lobby:');
    this.members.forEach(member => console.log(`${member.username}`));
  }

  addMessage(message: Message) {
    this.messages.push(message);
  }

  setHost(hostClient: Client) {
    this.host = new Member(this.members.get(hostClient.sessionId));
    this.members.forEach(member => {
      member.isHost = member.sessionId === hostClient.sessionId;
    });
    this.addMessage(
      new Message({
        _id: generateRandomUUID(),
        createdAt: new Date().getTime(),
        type: 'system-message',
        to: this._id,
        from: this.chatBot,
        content: `${this.host.username} is the host`,
      })
    );
    console.log(`${this.host.username} is the host`);
  }

  setRoute(route: string) {
    this.route = route;
  }

  setActivity(activity: Activity) {
    this.activity = activity;
  }

  setQueueType(queueType: QueueType) {
    this.queueType = queueType;
  }

  setGameType(gameType: GameType) {
    this.gameType = gameType;
  }

  setGameMode(gameMode: GameMode) {
    this.gameMode = gameMode;
  }

  setGameMap(gameMap: GameMap) {
    this.gameMap = gameMap;
  }

  toggleReady(member: Member) {
    this.members.get(member.sessionId).isReady = !this.members.get(
      member.sessionId
    ).isReady;
    this.determineIsReady();
  }

  determineIsReady(): boolean {
    let allReady = true;
    if (this.members.size === 1) {
      this.isReady = allReady;
      return allReady;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [sessionId, member] of this.members) {
      if (!member.isReady) {
        allReady = false;
        break;
      }
    }
    this.isReady = allReady; // state update
    return allReady;
  }

  assignColor(memberId: string) {
    if (!this.colorAssignments.has(memberId)) {
      const color = this.availableColors.shift() ?? '';
      this.colorAssignments.set(memberId, color);
      this.members.get(memberId).color = color;
    }
  }

  freeUpColor(memberId: string) {
    const color = this.colorAssignments.get(memberId);
    if (color) {
      this.availableColors.push(color);
      this.colorAssignments.delete(memberId);
    }
  }
}

export default LobbyState;
