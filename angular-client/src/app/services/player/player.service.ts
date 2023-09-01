import { Injectable } from '@angular/core';
import { Player } from 'src/app/models/player/player';
import { Scene } from '@babylonjs/core';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  players: Player[] = [];

  get(_id: string): Player {
    return this.players.find(player => player._id == _id);
  }

  getAll(): Player[] {
    return this.players;
  }

  async create(player: Player, scene: Scene): Promise<Player> {
    await player.importPlayerMesh(scene);
    await player.importMeleeSound(scene);
    this.players.push(player);
    return player;
  }
}
