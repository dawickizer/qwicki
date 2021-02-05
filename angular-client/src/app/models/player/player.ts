import { Mesh, Sound, Scene, SceneLoader } from '@babylonjs/core';
import { Gun } from 'src/app/models/gun/gun'

export class Player {

  _id?: string;
  playerMesh: Mesh;
  playerMeshURL: string;
  playerSound: Sound;
  playerSoundURL: string;
  name: string;
  type: string;
  primaryWeapon: Gun;
  secondaryWeapon: Gun;
  health: number;
  moveSpeed: number; // WASD
  cameraAngularSensibility: number; // controls mouse speed
  cameraInertia: number; // controls mouse 'smoothness'

  async importPlayerMesh(scene: Scene): Promise<Mesh> {
    this.playerMesh = (await SceneLoader.ImportMeshAsync('', this.playerMeshURL, '', scene)).meshes[0] as Mesh;
    this.playerMesh.id = this.name + '-PlayerMesh';
    this.playerMesh.name = this.name;
    return this.playerMesh;

  }

  async importPlayerSound(scene: Scene): Promise<Sound> {
    this.playerSound = new Sound('', this.playerSoundURL, scene, null);
    this.playerSound.name = this.name + '-PlayerSound';
    return this.playerSound;
  }

}
