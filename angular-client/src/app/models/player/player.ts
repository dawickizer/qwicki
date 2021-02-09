import { Mesh, Sound, Scene, SceneLoader, UniversalCamera, MeshBuilder, Vector3 } from '@babylonjs/core';
import { Gun } from 'src/app/models/gun/gun'

export class Player {

  _id?: string;
  username: string;
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
  justFired: boolean = false;
  canShoot: boolean = true;
  moveSpeed: number; // WASD
  cameraAngularSensibility: number; // controls mouse speed
  cameraInertia: number; // controls mouse 'smoothness'
  selectingMesh: Mesh = null;

  constructor(username?: string, name?: string) {
    this.username = username;
    this.name = name;
    this._id = name + '-' + username;
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

  setActiveWeapon(gun: Gun) {
    let temp = this.getActiveWeapon();
    temp = gun;
  }

  createSelectingMesh(scene: Scene, camera: UniversalCamera): Mesh {
    let cube = MeshBuilder.CreateBox('cube', {size: 10}, scene);

    // get the gun in a world position that is good for baking the verticies
    cube.position = new Vector3(0, -35, 10);
    cube.scaling = new Vector3(1, 6, 8);
    cube.isPickable = false;
    cube.visibility = 0;
    cube.parent = camera;
    this.selectingMesh = cube;
    return this.selectingMesh;
  }

}
