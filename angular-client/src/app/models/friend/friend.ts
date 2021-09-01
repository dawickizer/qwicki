export class Friend {
  _id?: string;
  username: string;
  usernameRaw?: string;

  constructor(username?: string, _id?: string, ) {
    this._id = _id;
    this.username = username;
  }
}