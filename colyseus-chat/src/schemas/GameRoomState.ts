import { Schema, type, MapSchema } from "@colyseus/schema";
import { User } from "./User";

export class GameRoomState extends Schema {
  @type({ map: User })
  users = new MapSchema<User>();
}
