import { Room, Client } from "colyseus";
import { ChatRoomState } from "./schema/ChatRoomState";
import { isAuthenticatedJWT } from "../../middleware/auth";
import http from 'http';

export class ChatRoom extends Room<ChatRoomState> {

  onCreate (options: any) {
    this.setState(new ChatRoomState());
    this.roomId = isAuthenticatedJWT(options.accessToken)._id;
    this.onMessage("type", (client, message) => console.log(message));
    console.log(this.roomId, "created!")
  }

  onAuth (client: Client, options: any, request: http.IncomingMessage) {
    return isAuthenticatedJWT(options.accessToken);
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
