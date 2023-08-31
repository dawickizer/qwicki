import { Room, Client } from "colyseus";
import { ChatRoomState } from "../schemas/ChatRoomState";
import { isAuthenticatedJWT } from "../middleware/auth";
import http from 'http';
import { User } from "../schemas/User";

export class ChatRoom extends Room<ChatRoomState> {

  hostClient: Client;

  onCreate (options: any) {
    this.setState(new ChatRoomState());
    this.roomId = isAuthenticatedJWT(options.accessToken)._id;
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
    this.hostClient.send("online", user);
  }

  onLeave (client: Client, consented: boolean) {
    if (this.isHost(client)) this.disconnectRoom();
    else this.removeClient(client);
  }

  onDispose() {
    console.log(`Room ${this.roomId} disposing`);
  }

  private setOnMessageListeners() {
    // set room listeners
    this.onMessage("sendFriendRequest", (client, friendRequest) => {
        this.hostClient.send("sendFriendRequest", friendRequest);
    });

    this.onMessage("acceptFriendRequest", (client, friendRequest) => {
        this.hostClient.send("acceptFriendRequest", friendRequest);
    });

    this.onMessage("rejectFriendRequest", (client, friendRequest) => {
        this.hostClient.send("rejectFriendRequest", friendRequest);
    });

    this.onMessage("revokeFriendRequest", (client, friendRequest) => {
        this.hostClient.send("revokeFriendRequest", friendRequest);
    });

    this.onMessage("removeFriend", (client, friend) => {
        this.hostClient.send("removeFriend", friend);
    });

    this.onMessage("disconnectFriend", (client, friend) => {
        let user = this.getUserById(friend._id);
        let userClient: Client = this.getClient(user);
        userClient.send("disconnectFriend", this.state.host);
        userClient.leave();
    });

    this.onMessage("messageHost", (client, message) => {
        this.hostClient.send("messageHost", message);
    });

    this.onMessage("messageUser", (client, message) => {
        let user = this.getUserById(message.to._id);
        let userClient: Client = this.getClient(user);
        userClient.send("messageUser", message);
    });
  }

  private getClient(user: User): Client {
    return this.clients.find(client => client.sessionId === user.sessionId)
  }

  private removeClient(client: Client) {
    let user: User = this.getUser(client);
    if (this.hostClient && user) this.hostClient.send("offline", user);
    this.deleteUser(user);
    this.logUsers();
  }

  private determineHost(user: User) {
    if (user._id === this.roomId) {
      this.state.host = user;
      this.hostClient = this.getClient(this.state.host);
      console.log(`${this.state.host.username} is the host`);
    } 
  }

  private addUser(user: User) {
    this.state.users.set(user.sessionId, user);
    console.log(`${user.username} joined`);
  }

  private deleteUser(user: User) {
    this.state.users.delete(user.sessionId);
    console.log(`${user.username} left`);
  }

  private getUser(client: Client): User {
    return this.state.users.get(client.sessionId);
  }

  private getUserById(id: string) {
    for (const user of this.state.users.values()) {
        if (user._id === id) {
            return user;
        }
    }
    return null;
}

  private logUsers() {
      console.log("Users in the chat:")
      this.state.users.forEach(user => console.log(`${user.username}`));
  }

  private disconnectRoom() {
    console.log("HOST IS LEAVING...disconnecting room")
    this.broadcast("offline", this.state.host);
    this.broadcast("dispose", this.roomId);
    this.disconnect();
  }

  private isHost(client: Client): boolean {
    return this.hostClient.sessionId === client.sessionId;
  }
}
