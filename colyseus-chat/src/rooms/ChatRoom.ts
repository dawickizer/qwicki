import { Room, Client } from "colyseus";
import { ChatRoomState } from "../schemas/ChatRoomState";
import { isAuthenticatedJWT } from "../middleware/auth";
import http from 'http';
import { User } from "../schemas/User";

export class ChatRoom extends Room<ChatRoomState> {

  onCreate (options: any) {
    this.setState(new ChatRoomState());
    this.roomId = isAuthenticatedJWT(options.accessToken)._id;
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

    let user: User = new User(client.sessionId, auth.username);

    // determine host
    if (auth._id === this.roomId) {
      this.state.host = user;
      console.log(`${this.state.host.username} is the host`);
    }
    this.state.users.set(user.sessionId, user);
    console.log(`${user.username} joined`);
    
    console.log("Users in the chat:")
    this.state.users.forEach(user => console.log(`${user.username}`));
  }

  onLeave (client: Client, consented: boolean) {
    if (this.state.host.sessionId === client.sessionId) this.disconnect();
    this.state.users.delete(client.sessionId);
    console.log(`${client.auth.username} left`);
    console.log("Users in the chat:")
    this.state.users.forEach(user => console.log(`${user.username}`));
  }

  onDispose() {
    console.log(`Room ${this.roomId} disposing`);
  }

}
