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
      color: '#FFFFFF',
    });
    this.determineHost(member);
    this.state.addMember(member);
    this.state.logMembers();
  }

  onLeave(client: Client) {
    if (this.isHost(client)) {
      const remainingMembers = Array.from(this.state.members.values()).filter(
        m => m.sessionId !== client.sessionId
      );
      if (remainingMembers.length > 0) {
        this.transferHost(
          this.clients.find(c => c.sessionId === remainingMembers[0].sessionId)
        );
        this.removeClient(client);
      } else {
        this.disconnectRoom();
      }
    } else {
      this.removeClient(client);
    }
  }

  onDispose() {
    console.log(`Room ${this.roomId} disposing`);
  }

  getClient(member: Member): Client {
    return this.clients.find(client => client.sessionId === member.sessionId);
  }

  removeClient(client: Client) {
    const member: Member = this.state.getMember(client);
    this.state.deleteMember(member);
    this.state.logMembers();
  }

  determineHost(member: Member) {
    if (member._id === this.roomId) {
      this.state.host = member;
      this.state.host.isHost = true;
      this.hostClient = this.getClient(this.state.host);
      console.log(`${this.state.host.username} is the host`);
    }
  }

  transferHost(newHostClient: Client) {
    console.log(
      `Transfering host from ${
        this.state.getMember(this.hostClient).username
      } to ${this.state.getMember(newHostClient).username}`
    );
    this.hostClient = newHostClient;
    this.state.setHost(newHostClient);
    console.log(`${this.state.host.username} is the host`);
  }

  isHost(client: Client): boolean {
    return this.hostClient.sessionId === client.sessionId;
  }

  disconnectRoom() {
    console.log('HOST IS LEAVING...disconnecting room');
    this.disconnect();
  }

  private setManagers() {
    this.lobbyManager = new LobbyManager(this);
  }
}
