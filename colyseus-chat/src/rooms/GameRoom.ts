import { Room, Client } from "colyseus";
import { isAuthenticatedJWT } from "../middleware/auth";
import http from 'http';
import { User } from "../schemas/User";
import { GameRoomState } from "../schemas/GameRoomState";

export class GameRoom extends Room<GameRoomState> {

  onCreate (options: any) {
    this.setState(new GameRoomState());
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
    this.state.users.set(user.sessionId, user);
    console.log(`${user.username} joined`);
    this.logUsers();
  }

  onLeave (client: Client, consented: boolean) {
    this.state.users.delete(client.sessionId);
    console.log(`${client.auth.username} left`);
    this.logUsers();
  }

  onDispose() {
    console.log(`Room ${this.roomId} disposing`);
  }

  private logUsers() {
    console.log("Users in the game:")
    this.state.users.forEach(user => console.log(`${user.username}`));
  }

}
