import { User } from "../user/user";

export class Game {
    _id?: string;
    name: string;
    mode: string = 'Sandbox';
    map: string = 'Default';
    createdAt: Date;
    createdBy: User;
}