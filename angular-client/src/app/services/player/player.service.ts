import { Injectable } from '@angular/core';
import { Player } from 'src/app/models/player/player'
import { Gun } from 'src/app/models/gun/gun'
import { Scene } from '@babylonjs/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  players: Player[] = [];

  constructor() {}

  get(_id: String): Player {
    return this.players.find(player => player._id == _id);
  }

  getAll(): Player[] {
    return this.players
  }

  async create(player: Player, scene: Scene): Promise<Player> {
    await player.importPlayerMesh(scene);
    this.players.push(player);
    return player;
  }
}
