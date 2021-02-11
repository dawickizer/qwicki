import { Mesh, Sound, Scene, SceneLoader, Vector3, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';

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
  reloadSoundURL: string;
  cockingSound: Sound = null;
  cockingSoundURL: string;

  async importGunMesh(scene: Scene): Promise<Mesh> {
    this.gunMesh = (await SceneLoader.ImportMeshAsync('', this.gunMeshURL, '', scene)).meshes[0] as Mesh;
    this.gunMesh.id = this.name + '-Mesh';
    this.gunMesh.name = this.name;
    return this.gunMesh;

  }

  // async importGunMesh(scene: Scene): Promise<Mesh> {

  //   let meshes = (await SceneLoader.ImportMeshAsync('', this.gunMeshURL, '', scene)).meshes as Mesh[];
  //   let children = meshes[0].getChildMeshes();
  //   this.gunMesh = new Mesh(this.name);
  //   for (let i = 0; i < children.length; i++) children[i].setParent(this.gunMesh);
  //   return this.gunMesh;

  // }

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

  async importCockingSound(scene: Scene): Promise<Sound> {
    this.cockingSound = new Sound('', this.cockingSoundURL, scene, null);
    this.cockingSound.setVolume(.2);
    this.cockingSound.name = this.name + '-CockingSound'
    return this.cockingSound;
  }

  async createGunMesh(type: string, scene: Scene): Promise<Mesh> {

    if (type == 'primary') {
      let cube = MeshBuilder.CreateBox('cube', {size: 10}, scene);
      let mat = new StandardMaterial('primary', scene);
      mat.diffuseColor = Color3.Gray();

      // get the gun in a world position that is good for baking the verticies
      cube.position = new Vector3(4, -6, 20);
      cube.scaling = new Vector3(.25, .25, 3);
      cube.rotationQuaternion = null;
      cube.rotation = new Vector3(0, 0, 0);
      cube.material = mat;
      cube.isPickable = false;
      for (let i = 0; i < cube.getChildMeshes().length; i++) cube.getChildMeshes()[i].isPickable = false;

      // make new default 0,0,0 settings so that the gun can rotate 'properly' relative to the camera
      cube.bakeCurrentTransformIntoVertices(); 

      this.gunMesh = cube;

    } else if (type == 'secondary') {
      let cube = MeshBuilder.CreateBox('cube', {size: 10}, scene);
      let mat = new StandardMaterial('primary', scene);
      mat.diffuseColor = Color3.Purple();

      // get the gun in a world position that is good for baking the verticies
      cube.position = new Vector3(4, -6, 20);
      cube.scaling = new Vector3(.25, .25, 1);
      cube.rotationQuaternion = null;
      cube.rotation = new Vector3(0, 0, 0);
      cube.material = mat;
      cube.isPickable = false;
      for (let i = 0; i < cube.getChildMeshes().length; i++) cube.getChildMeshes()[i].isPickable = false;

      // make new default 0,0,0 settings so that the gun can rotate 'properly' relative to the camera
      cube.bakeCurrentTransformIntoVertices(); 
      
      this.gunMesh = cube;

    } else if (type == 'spare') {
      let cube = MeshBuilder.CreateBox('cube', {size: 10}, scene);
      let mat = new StandardMaterial('spare', scene);
      mat.diffuseColor = Color3.Yellow();

      // get the gun in a world position that is good for baking the verticies
      cube.position = new Vector3(4, -6, 20);
      cube.scaling = new Vector3(.6, .25, 3);
      cube.rotationQuaternion = null;
      cube.rotation = new Vector3(0, 0, 0);
      cube.material = mat;
      cube.isPickable = false;
      for (let i = 0; i < cube.getChildMeshes().length; i++) cube.getChildMeshes()[i].isPickable = false;

      // make new default 0,0,0 settings so that the gun can rotate 'properly' relative to the camera
      cube.bakeCurrentTransformIntoVertices(); 

      this.gunMesh = cube;

    }

    this.gunMesh.id = this.name + '-Mesh';
    this.gunMesh.name = this.name;

    return this.gunMesh;
  }
}
