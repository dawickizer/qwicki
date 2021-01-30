import { Injectable } from '@angular/core';
import { Gun } from 'src/app/models/gun/gun';
import { Mesh, Sound, Scene, SceneLoader, Vector3 } from '@babylonjs/core';

@Injectable({
  providedIn: 'root'
})
export class GunService {

  guns: Gun[] = [];
  m4: Gun = new Gun();

  constructor() { 
    
    // create m4
    this.m4.gunMesh = null;
    this.m4.gunMeshURL = 'assets/babylon/models/m4/scene.gltf';
    this.m4.name = 'm4';
    this.m4.magazine = 30;
    this.m4.ammo = 30;
    this.m4.fireRate = 75;
    this.m4.gunshotSound = null;
    this.m4.gunshotSoundURL = 'assets/babylon/sounds/m4/gunshot.mp3';
    this.m4.reloadSound = null;
    this.m4.reloadSoundURL = 'assets/babylon/sounds/m4/reload.mp3';
    this.guns.push(this.m4);
  }

  async get(name: String, scene: Scene): Promise<Gun> {
    let gun: Gun = this.guns.find(gun => gun.name == name);
    await gun.importGunMesh(scene);
    await gun.importGunshotSound(scene);
    await gun.importReloadSound(scene);
    return gun;
  }

}
