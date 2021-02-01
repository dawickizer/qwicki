import { Mesh, Sound, Scene, SceneLoader, Vector3 } from '@babylonjs/core';

export class Gun {

  _id?: string;
  gunMesh: Mesh;
  gunMeshURL: string;
  name: string;
  magazine: number;
  ammo: number;
  fireRate: number;
  fireType: string;
  gunshotSound: Sound;
  gunshotSoundURL: string;
  reloadSound: Sound;
  reloadSoundURL: string

  async importGunMesh(scene: Scene): Promise<Mesh> {
    this.gunMesh = (await SceneLoader.ImportMeshAsync('', this.gunMeshURL, '', scene)).meshes[0] as Mesh;

    // set some default scaling so the gun size/orientation is nice
    this.gunMesh.scaling = new Vector3(.25, .25, .25); 

    this.gunMesh.bakeCurrentTransformIntoVertices(); // bascially says "hey the current rotation/scaling of the mesh is now the new zeroed out position"

    // id the mesh
    this.gunMesh.id = this.name + 'Mesh';
    this.gunMesh.name = this.name + 'Mesh';
    return this.gunMesh;

  }

  async importGunshotSound(scene: Scene): Promise<Sound> {
    this.gunshotSound = new Sound('', this.gunshotSoundURL, scene, null);
    this.gunshotSound.setVolume(.5);
    this.gunshotSound.name = this.name + 'GunshotSound';
    return this.gunshotSound;
  }

  async importReloadSound(scene: Scene): Promise<Sound> {
    this.reloadSound = new Sound('', this.reloadSoundURL, scene, null);
    this.reloadSound.setVolume(.2);
    this.reloadSound.name = this.name + 'ReloadSound'
    return this.reloadSound;
  }

  // dispose(scene: Scene) {

  //   // remove mesh/child meshes from scene
  //   scene.removeMesh(this.gunMesh, true); 

  //   // dispose of child meshes under the active camera
  //   for (let i = 0; i < scene.activeCamera.getChildMeshes().length; i++) scene.activeCamera.getChildMeshes()[i].dispose(true, true)

  //   // dispose of gun mesh
  //   this.gunMesh.dispose(true, true);

  //   // dispose of sounds
  //   this.gunshotSound.dispose();
  //   this.reloadSound.dispose();   
  // }

}
