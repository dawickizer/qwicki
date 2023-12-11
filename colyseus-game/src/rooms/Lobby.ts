import { Room, Client } from 'colyseus';
import { isAuthenticatedJWT } from '../middleware/auth';
import LobbyState from '../schemas/lobby/LobbyState';
import { Member } from '../schemas/lobby/Member';
import { LobbyManager } from '../managers/LobbyManager';

export class Lobby extends Room<LobbyState> {
  hostClient: Client;

  lobbyManager: LobbyManager;

  onCreate(options: any) {
    this.setState(new LobbyState());
    this.roomId = isAuthenticatedJWT(options.jwt)._id;
    this.maxClients = 5;
    this.setManagers();
    console.log(`Room ${this.roomId} created`);
  }

  onAuth(client: Client, options: any) {
    console.log('Authenticating member...');
    // whatever is returned will be tacked onto the client object in onJoin()/onLeave()
    // as auth: {returnValue} and it will be added as a third optional auth
    // parameter to the onJoin() method
    return isAuthenticatedJWT(options.jwt);
  }

  onJoin(client: Client, options: any, auth: any) {
    const member: Member = new Member({
      _id: auth._id,
      sessionId: client.sessionId,
      username: auth.username,
      isHost: false,
    });
    this.determineHost(member);
    this.addMember(member);
    this.logMembers();
  }

  onLeave(client: Client) {
    if (this.isHost(client)) this.disconnectRoom();
    else this.removeClient(client);
  }

  onDispose() {
    console.log(`Room ${this.roomId} disposing`);
  }

  getClient(member: Member): Client {
    return this.clients.find(client => client.sessionId === member.sessionId);
  }

  removeClient(client: Client) {
    const member: Member = this.getMember(client);
    this.deleteMember(member);
    this.logMembers();
  }

  determineHost(member: Member) {
    if (member._id === this.roomId) {
      this.state.host = member;
      this.state.host.isHost = true;
      this.hostClient = this.getClient(this.state.host);
      console.log(`${this.state.host.username} is the host`);
    }
  }

  addMember(member: Member) {
    this.state.members.set(member.sessionId, member);
    console.log(`${member.username} joined`);
  }

  deleteMember(member: Member) {
    this.state.members.delete(member.sessionId);
    console.log(`${member.username} left`);
  }

  getMember(client: Client): Member {
    return this.state.members.get(client.sessionId);
  }

  getMemberById(id: string) {
    for (const member of this.state.members.values()) {
      if (member._id === id) {
        return member;
      }
    }
    return null;
  }

  logMembers() {
    console.log('Members in the chat:');
    this.state.members.forEach(member => console.log(`${member.username}`));
  }

  disconnectRoom() {
    console.log('HOST IS LEAVING...disconnecting room');
    this.disconnect();
  }

  isHost(client: Client): boolean {
    return this.hostClient.sessionId === client.sessionId;
  }

  private setManagers() {
    this.lobbyManager = new LobbyManager(this);
  }
}
