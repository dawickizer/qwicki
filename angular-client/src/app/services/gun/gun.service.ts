import { Injectable } from '@angular/core';
import { Gun } from 'src/app/models/gun/gun';
import { Scene } from '@babylonjs/core';

@Injectable({
  providedIn: 'root'
})
export class GunService {

  guns: Gun[] = [];

  constructor() {}

  get(name: String): Gun {
    return this.guns.find(gun => gun.name == name);
  }

  getAll(): Gun[] {
    return this.guns;
  }

  async create(gun: Gun, scene: Scene): Promise<Gun> {
    await gun.importGunMesh(scene);
    await gun.importGunshotSound(scene);
    await gun.importReloadSound(scene);
    this.guns.push(gun);
    return gun;
  }


}
