import { Mesh, Sound, Scene, SceneLoader } from '@babylonjs/core';
import { Gun } from 'src/app/models/gun/gun'

export class Player {

  _id?: string;
  userId: string;
  name: string;
  playerMesh: Mesh = null;
  playerMeshURL: string;
  playerSound: Sound = null;
  playerSoundURL: string;
  primaryWeapon: Gun = null;
  secondaryWeapon: Gun = null;
  activeWeaponName: string;
  health: number = 100;
  wasHitRecently: boolean = false;
  lastDamagedBy: string;
  swappingWeapons: boolean = false;
  moveSpeed: number; // WASD
  cameraAngularSensibility: number; // controls mouse speed
  cameraInertia: number; // controls mouse 'smoothness'

  constructor(userId?: string, name?: string) {
    this.userId = userId;
    this.name = name;
    this._id = name + '-' + userId
  }

  async importPlayerMesh(scene: Scene): Promise<Mesh> {
    this.playerMesh = (await SceneLoader.ImportMeshAsync('', this.playerMeshURL, '', scene)).meshes[0] as Mesh;
    this.playerMesh.id = this._id;
    this.playerMesh.name = this.name;
    return this.playerMesh;

  }

  async importPlayerSound(scene: Scene): Promise<Sound> {
    this.playerSound = new Sound('', this.playerSoundURL, scene, null);
    this.playerSound.name = this.name + '-PlayerSound';
    return this.playerSound;
  }

  getActiveWeapon(): Gun {
    if (this.activeWeaponName == this.primaryWeapon.name) return this.primaryWeapon;
    else if (this.activeWeaponName == this.secondaryWeapon.name) return this.secondaryWeapon
  }

}
