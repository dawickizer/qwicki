import { Room, Client } from 'colyseus';
import { InboxState } from '../schemas/InboxState';
import { isAuthenticatedJWT } from '../middleware/auth';
import { User } from '../schemas/User';
import { FriendManager } from '../managers/FriendManager';
import { ChatManager } from '../managers/ChatManager';
import { PresenceManager } from '../managers/PresenceManager';
import { InviteManager } from '../managers/InviteManager';
import { Status } from '../schemas/Status';

export class Inbox extends Room<InboxState> {
  hostClient: Client;

  private friendManager: FriendManager;
  private chatManager: ChatManager;
  private presenceManager: PresenceManager;
  private inviteManager: InviteManager;

  onCreate(options: any) {
    this.setState(new InboxState());
    this.roomId = isAuthenticatedJWT(options.jwt)._id;
    this.setManagers();
    console.log(`Room ${this.roomId} created`);
  }

  onAuth(client: Client, options: any) {
    console.log('Authenticating user...');
    // whatever is returned will be tacked onto the client object in onJoin()/onLeave()
    // as auth: {returnValue} and it will be added as a third optional auth
    // parameter to the onJoin() method
    return isAuthenticatedJWT(options.jwt);
  }

  onJoin(client: Client, options: any, auth: any) {
    const user: User = new User({
      _id: auth._id,
      sessionId: client.sessionId,
      username: auth.username,
      status: options.status,
      presence: options.presence,
    });
    this.determineHost(user);
    this.addUser(user);
    this.logUsers();
    if (!this.isHost(client)) {
      this.presenceManager.notifyHostUserStatus(user);
      this.presenceManager.notifyHostUserPresence(user);
    }
  }

  onLeave(client: Client) {
    if (this.isHost(client)) this.disconnectRoom();
    else this.removeClient(client);
  }

  onDispose() {
    console.log(`Room ${this.roomId} disposing`);
  }

  getClient(user: User): Client {
    return this.clients.find(client => client.sessionId === user.sessionId);
  }

  removeClient(client: Client) {
    const user: User = this.getUser(client);
    if (this.hostClient && user) {
      this.presenceManager.notifyHostUserStatus(user, new Status());
      this.presenceManager.notifyHostUserPresence(user, 'Offline');
    }
    this.deleteUser(user);
    this.logUsers();
  }

  determineHost(user: User) {
    if (user._id === this.roomId) {
      this.state.host = user;
      this.hostClient = this.getClient(this.state.host);
      console.log(`${this.state.host.username} is the host`);
    }
  }

  addUser(user: User) {
    this.state.users.set(user.sessionId, user);
    console.log(`${user.username} joined`);
  }

  deleteUser(user: User) {
    this.state.users.delete(user.sessionId);
    console.log(`${user.username} left`);
  }

  getUser(client: Client): User {
    return this.state.users.get(client.sessionId);
  }

  getUserById(id: string) {
    for (const user of this.state.users.values()) {
      if (user._id === id) {
        return user;
      }
    }
    return null;
  }

  logUsers() {
    console.log('Users in the chat:');
    this.state.users.forEach(user =>
      console.log(`${user.username} - ${user?.presence}`)
    );
  }

  disconnectRoom() {
    console.log('HOST IS LEAVING...disconnecting room');
    this.presenceManager.broadcastDisposeRoom();
    this.disconnect();
  }

  isHost(client: Client): boolean {
    return this.hostClient.sessionId === client.sessionId;
  }

  private setManagers() {
    this.friendManager = new FriendManager(this);
    this.chatManager = new ChatManager(this);
    this.presenceManager = new PresenceManager(this);
    this.inviteManager = new InviteManager(this);
  }
}
