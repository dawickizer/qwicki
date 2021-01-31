import { Injectable } from '@angular/core';
import { Gun } from 'src/app/models/gun/gun';
import { Mesh, Sound, Scene, SceneLoader, Vector3 } from '@babylonjs/core';

@Injectable({
  providedIn: 'root'
})
export class GunService {

  guns: Gun[] = [];
  m4: Gun = new Gun();
  fake: Gun = new Gun();


  constructor() { 
    
    // create m4
    this.m4.gunMesh = null;
    this.m4.gunMeshURL = 'assets/babylon/models/m4/scene.gltf';
    this.m4.name = 'm4';
    this.m4.magazine = 30;
    this.m4.ammo = 30;
    this.m4.fireRate = 65;
    this.m4.gunshotSound = null;
    this.m4.gunshotSoundURL = 'assets/babylon/sounds/m4/gunshot.mp3';
    this.m4.reloadSound = null;
    this.m4.reloadSoundURL = 'assets/babylon/sounds/m4/reload.mp3';
    this.guns.push(this.m4);

    // create fake
    this.fake.gunMesh = null;
    this.fake.gunMeshURL = 'assets/babylon/models/m4/scene.gltf';
    this.fake.name = 'fake';
    this.fake.magazine = 10;
    this.fake.ammo = 10;
    this.fake.fireRate = 500;
    this.fake.gunshotSound = null;
    this.fake.gunshotSoundURL = 'assets/babylon/sounds/m4/gunshot.mp3';
    this.fake.reloadSound = null;
    this.fake.reloadSoundURL = 'assets/babylon/sounds/m4/reload.mp3';
    this.guns.push(this.fake);
  }

  async get(name: String, scene: Scene): Promise<Gun> {
    let gun: Gun = this.guns.find(gun => gun.name == name);
    await gun.importGunMesh(scene);
    await gun.importGunshotSound(scene);
    await gun.importReloadSound(scene);
    return gun;
  }

  async getAll(scene: Scene): Promise<Gun[]> {
    for (let i = 0; i < this.guns.length; i++) {
      await this.guns[i].importGunMesh(scene);
      await this.guns[i].importGunshotSound(scene);
      await this.guns[i].importReloadSound(scene);
    }

    return this.guns;
  }


}
