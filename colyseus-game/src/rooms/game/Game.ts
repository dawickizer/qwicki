import { Room, Client } from 'colyseus';
import { isAuthenticatedJWT } from '../../middleware/auth';
import { Player } from '../../schemas/player/Player';
import { GameState } from '../../schemas/game/GameState';

export class Game extends Room<GameState> {
  private _hostJoined: boolean = false;

  onCreate() {
    this.setState(new GameState());

    this.onMessage('move', (client: Client, message: any) => {
      const player: Player = this.state.players.get(client.sessionId);
      console.log(player.username + ' position');
      console.log(message);
      player.position.x = message._x;
      player.position.y = message._y;
      player.position.z = message._z;
    });

    this.onMessage('rotate', (client: Client, message: any) => {
      const player: Player = this.state.players.get(client.sessionId);
      console.log(player.username + ' rotation');
      console.log(message);
      player.rotation.x = message._x;
      player.rotation.y = message._y;
      player.rotation.z = message._z;
    });

    console.log(`Room ${this.roomId} created`);
  }

  onAuth(client: Client, options: any) {
    console.log('Authenticating player...');
    // whatever is returned will be tacked onto the client object in onJoin()/onLeave()
    // as auth: {returnValue} and it will be added as a third optional auth
    // parameter to the onJoin() method
    return isAuthenticatedJWT(options.jwt);
  }

  onJoin(client: Client, options: any, auth: any) {
    if (!this._hostJoined) {
      console.log('HOST JOINED');
      this._hostJoined = true;
      this.setMetadata(this.initMetadata(options));
    }

    const player: Player = new Player({
      _id: auth._id,
      sessionId: client.sessionId,
      username: auth.username,
    });
    this.state.players.set(player.sessionId, player);
    console.log(`${player.username} joined`);
    this.logPlayers();
  }

  initMetadata(options: any): any {
    const decodedJWT = isAuthenticatedJWT(options.jwt);
    return {
      ...options.game,
      createdAt: new Date(),
      createdBy: {
        _id: decodedJWT._id,
        username: decodedJWT.username,
      },
    };
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    console.log(`${client.auth.username} left`);
    this.logPlayers();
  }

  onDispose() {
    console.log(`Room ${this.roomId} disposing`);
  }

  private logPlayers() {
    console.log('Players in the game:');
    this.state.players.forEach(player => console.log(`${player.username}`));
  }
}
