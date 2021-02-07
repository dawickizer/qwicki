import { Mesh, Sound, Scene, SceneLoader, Vector3 } from '@babylonjs/core';

export class Gun {

  _id?: string;
  gunMesh: Mesh = null;
  gunMeshURL: string;
  name: string;
  magazine: number;
  ammo: number;
  fireRate: number;
  fireType: string;
  damage: number;
  gunshotSound: Sound = null;
  gunshotSoundURL: string;
  reloadSound: Sound = null;
  reloadSoundURL: string

  async importGunMesh(scene: Scene): Promise<Mesh> {
    this.gunMesh = (await SceneLoader.ImportMeshAsync('', this.gunMeshURL, '', scene)).meshes[0] as Mesh;
    this.gunMesh.id = this.name + '-Mesh';
    this.gunMesh.name = this.name;
    return this.gunMesh;

  }

  async importGunshotSound(scene: Scene): Promise<Sound> {
    this.gunshotSound = new Sound('', this.gunshotSoundURL, scene, null);
    this.gunshotSound.setVolume(.5);
    this.gunshotSound.name = this.name + '-GunshotSound';
    return this.gunshotSound;
  }

  async importReloadSound(scene: Scene): Promise<Sound> {
    this.reloadSound = new Sound('', this.reloadSoundURL, scene, null);
    this.reloadSound.setVolume(.2);
    this.reloadSound.name = this.name + '-ReloadSound'
    return this.reloadSound;
  }
}
