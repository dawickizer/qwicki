import { Room, Client } from "colyseus";
import { ChatRoomState } from "../schemas/ChatRoomState";
import { isAuthenticatedJWT } from "../middleware/auth";
import http from 'http';
import { User } from "../schemas/User";

export class ChatRoom extends Room<ChatRoomState> {

  onCreate (options: any) {
    this.setState(new ChatRoomState());
    this.roomId = isAuthenticatedJWT(options.accessToken)._id;

    this.state.host = new User('HOST');

    console.log(this.roomId, "created!")
  }

  onAuth (client: Client, options: any, request: http.IncomingMessage) {
    return isAuthenticatedJWT(options.accessToken);
  }

  onJoin (client: Client, options: any) {
    this.state.users.set(client.sessionId, new User());
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    this.state.users.delete(client.sessionId);
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
