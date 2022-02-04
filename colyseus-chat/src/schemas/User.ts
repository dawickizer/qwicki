import { Schema, type } from "@colyseus/schema";

export class User extends Schema {
    @type("string")
    name: string;
  
    constructor(name?: string) {
       super(); 
       this.name = name ?? 'NOT HOST';
    }
}
  