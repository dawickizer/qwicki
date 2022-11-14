import { Schema, type } from "@colyseus/schema";

export class User extends Schema {
    @type("string")
    sessionId: string;
  
    constructor(sessionId: string) {
       super(); 
       this.sessionId = sessionId;
    }
}
  