import { Mesh, Sound, Scene, SceneLoader, Vector3 } from '@babylonjs/core';
export class Gun {

  _id?: string;
  gunMesh: Mesh;
  gunMeshURL: string;
  name: string;
  magazine: number;
  ammo: number;
  fireRate: number;
  gunshotSound: Sound;
  gunshotSoundURL: string;
  reloadSound: Sound;
  reloadSoundURL: string

  async importGunMesh(scene: Scene): Promise<Mesh> {
    let meshes = (await SceneLoader.ImportMeshAsync('', this.gunMeshURL), scene).meshes as Mesh[];

    // clean up nodes
    meshes[1].parent = meshes[0];
    meshes[2].parent = meshes[0];
    this.gunMesh = meshes[0];
    this.gunMesh.getChildren()[0].dispose();

    // set some default scaling/rotation so the gun size/orientation is nice
    this.gunMesh.rotation = new Vector3(1.5, 0, 0);
    this.gunMesh.scaling = new Vector3(.25, .25, -.25); 

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
