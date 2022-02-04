import { Schema, type, MapSchema } from "@colyseus/schema";
import { User } from "./User";

export class ChatRoomState extends Schema {

  @type(User)
  host = new User();

  @type({ map: User })
  users = new MapSchema<User>();
}
