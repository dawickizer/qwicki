import { Schema, type } from "@colyseus/schema";

export class User extends Schema {
    @type("string")
    sessionId: string;

    @type("string")
    username: string;
  
    constructor(sessionId: string, username: string) {
       super(); 
       this.sessionId = sessionId;
       this.username = username;
    }
}
  