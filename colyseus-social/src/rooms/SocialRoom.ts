import { Room, Client } from "colyseus";
import { ChatRoomState } from "../schemas/ChatRoomState";
import { isAuthenticatedJWT } from "../middleware/auth";
import http from 'http';
import { User } from "../schemas/User";
import { FriendManager } from "../managers/FriendManager";
import { ChatManager } from "../managers/ChatManager";
import { PresenceManager } from "../managers/PresenceManager";

export class SocialRoom extends Room<ChatRoomState> {

  hostClient: Client;

  private friendManager: FriendManager;
  private chatManager: ChatManager;
  private presenceManager: PresenceManager;

  onCreate (options: any) {
    this.setState(new ChatRoomState());
    this.roomId = isAuthenticatedJWT(options.accessToken)._id;
    this.setManagers();
    this.setOnMessageListeners();
    console.log(`Room ${this.roomId} created`);
  }

  onAuth (client: Client, options: any, request: http.IncomingMessage) {
    console.log("Authenticating user...")
    // whatever is returned will be tacked onto the client object in onJoin()/onLeave() 
    // as auth: {returnValue} and it will be added as a third optional auth 
    // parameter to the onJoin() method
    return isAuthenticatedJWT(options.accessToken); 
  }

  onJoin (client: Client, options: any, auth: any) {
    let user: User = new User(auth._id, client.sessionId, auth.username);
    this.determineHost(user);
    this.addUser(user);
    this.logUsers();
    this.presenceManager.notifyHostUserIsOnline(user);
  }

  onLeave (client: Client, consented: boolean) {
    if (this.isHost(client)) this.disconnectRoom();
    else this.removeClient(client);
  }

  onDispose() {
    console.log(`Room ${this.roomId} disposing`);
  }

  getClient(user: User): Client {
    return this.clients.find(client => client.sessionId === user.sessionId)
  }

  removeClient(client: Client) {
    let user: User = this.getUser(client);
    if (this.hostClient && user) this.presenceManager.notifyHostUserIsOffline(user);
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
      console.log("Users in the chat:")
      this.state.users.forEach(user => console.log(`${user.username}`));
  }

  disconnectRoom() {
    console.log("HOST IS LEAVING...disconnecting room");
    this.presenceManager.broadcastHostOffline();
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
  }

  private setOnMessageListeners() {
    this.friendManager.setOnMessageListeners();
    this.chatManager.setOnMessageListeners();
  }
}
