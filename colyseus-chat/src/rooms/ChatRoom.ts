import { Room, Client } from "colyseus";
import { ChatRoomState } from "../schemas/ChatRoomState";
import { isAuthenticatedJWT } from "../middleware/auth";
import http from 'http';
import { User } from "../schemas/User";

export class ChatRoom extends Room<ChatRoomState> {

  onCreate (options: any) {
    this.setState(new ChatRoomState());
    this.roomId = isAuthenticatedJWT(options.accessToken)._id;

    // set room listeners
    this.onMessage("inboundFriendRequest", (client, friendRequest) => {
      let hostClient: Client = this.clients.find(client => client.sessionId === this.state.host.sessionId);
      hostClient.send("inboundFriendRequest", friendRequest);
    });

    this.onMessage("acceptFriendRequest", (client, friendRequest) => {
      let hostClient: Client = this.clients.find(client => client.sessionId === this.state.host.sessionId);
      hostClient.send("acceptFriendRequest", friendRequest);
    });

    this.onMessage("rejectFriendRequest", (client, friendRequest) => {
      let hostClient: Client = this.clients.find(client => client.sessionId === this.state.host.sessionId);
      hostClient.send("rejectFriendRequest", friendRequest);
    });

    this.onMessage("revokeFriendRequest", (client, friendRequest) => {
      let hostClient: Client = this.clients.find(client => client.sessionId === this.state.host.sessionId);
      hostClient.send("revokeFriendRequest", friendRequest);
    });

    this.onMessage("removeFriend", (client, friend) => {
      let hostClient: Client = this.clients.find(client => client.sessionId === this.state.host.sessionId);
      hostClient.send("removeFriend", friend);
    });


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

    // determine host
    if (auth._id === this.roomId) {
      this.state.host = user;
      console.log(`${this.state.host.username} is the host`);
    }

    // add host/user to users
    this.state.users.set(user.sessionId, user);
    console.log(`${user.username} joined`);
    
    // show users in room
    console.log("Users in the chat:")
    this.state.users.forEach(user => console.log(`${user.username}`));

    // Send message to host client that someone (including self) joined
    let hostClient: Client = this.clients.find(client => client.sessionId === this.state.host.sessionId);
    hostClient.send("online", user);
  }

  onLeave (client: Client, consented: boolean) {

    // disconnect room totally if host leaves
    if (this.state.host.sessionId === client.sessionId) {
      console.log("HOST IS LEAVING...disconnecting room")
      this.broadcast("offline", this.state.host);
      this.broadcast("dispose", this.roomId);
      this.disconnect();
    }
    else {
      // Send message to host client that someone (including self) left
      let user: User = this.state.users.get(client.sessionId);
      let hostClient: Client = this.clients.find(client => client.sessionId === this.state.host.sessionId);
      if (hostClient) hostClient.send("offline", user);

      this.state.users.delete(client.sessionId);
      console.log(`${client.auth.username} left`);
      console.log("Users in the chat:")
      this.state.users.forEach(user => console.log(`${user.username}`));
    }
  }

  onDispose() {
    console.log(`Room ${this.roomId} disposing`);
  }

}
