import { Room, Client } from "colyseus";
import { ChatRoomState } from "./schema/ChatRoomState";
import { isAuthenticatedJWT } from "../../middleware/auth";
import http from 'http';

export class ChatRoom extends Room<ChatRoomState> {

  onCreate (options: any) {
    this.setState(new ChatRoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
      console.log(message)
    });

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
