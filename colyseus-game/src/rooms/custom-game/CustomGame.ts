import { Room, Client } from 'colyseus';
import { isAuthenticatedJWT } from '../../middleware/auth';
import { Player } from '../../schemas/player/Player';
import { CustomGameManager } from '../../managers/custom-game/CustomGameManager';
import { CustomGameState } from '../../schemas/custom-game/CustomGameState';

export class CustomGame extends Room<CustomGameState> {
  hostClient: Client;
  customGameManager: CustomGameManager;

  onCreate() {
    this.setState(
      new CustomGameState({
        _id: this.roomId,
        name: 'Custom Game',
        route: '/custom-game',
        activity: 'In Pregame Lobby',
        gameType: 'Custom',
        gameMode: 'Team Deathmatch',
        gameMap: 'Bucheon',
        visibility: 'Private (Invite Only)',
        maxPlayerCount: 12,
      })
    );
    this.maxClients = 12;
    this.setPrivate(true);
    this.setManagers();
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
    const player: Player = new Player({
      _id: auth._id,
      sessionId: client.sessionId,
      username: auth.username,
      isHost: false,
      color: '#FFFFFF',
    });
    this.state.addPlayer(player);
    this.determineHost(player);
  }

  onLeave(client: Client) {
    if (this.isHost(client)) {
      const remainingPlayers = Array.from(this.state.players.values()).filter(
        m => m.sessionId !== client.sessionId
      );
      if (remainingPlayers.length > 0) {
        this.transferHost(
          this.clients.find(c => c.sessionId === remainingPlayers[0].sessionId)
        );
        this.removeClient(client);
      } else {
        this.disconnectRoom();
      }
    } else {
      this.removeClient(client);
    }
  }

  onDispose() {
    console.log(`Room ${this.roomId} disposing`);
  }

  getClient(player: Player): Client {
    return this.clients.find(client => client.sessionId === player.sessionId);
  }

  removeClient(client: Client) {
    const player: Player = this.state.getPlayer(client);
    this.state.deletePlayer(player);
  }

  determineHost(player: Player) {
    if (!this.hostClient) {
      this.hostClient = this.getClient(player);
      this.state.setHost(this.hostClient);
    }
  }

  transferHost(newHostClient: Client) {
    console.log(
      `Transfering host from ${
        this.state.getPlayer(this.hostClient).username
      } to ${this.state.getPlayer(newHostClient).username}`
    );
    this.hostClient = newHostClient;
    this.state.setHost(newHostClient);
    this.customGameManager.broadcastTransferHost();
  }

  isHost(client: Client): boolean {
    return this.hostClient.sessionId === client.sessionId;
  }

  disconnectRoom() {
    console.log('HOST IS LEAVING...disconnecting room');
    this.disconnect();
  }

  private setManagers() {
    this.customGameManager = new CustomGameManager(this);
  }
}
