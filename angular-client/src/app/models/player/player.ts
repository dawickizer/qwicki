import { Mesh, Sound, Scene, SceneLoader, UniversalCamera, MeshBuilder, Vector3, StandardMaterial, Color3 } from '@babylonjs/core';
import { Gun } from 'src/app/models/gun/gun'

export class Player {

  _id?: string;
  sessionId?: string;
  username: string;
  name: string;
  playerMesh: Mesh = null;
  playerMeshURL: string;
  meleeSound: Sound = null;
  meleeSoundURL: string;
  primaryWeapon: Gun = null;
  secondaryWeapon: Gun = null;
  activeWeaponName: string;
  meleeWeapon: Mesh = null;
  health: number = 100;
  wasHitRecently: boolean = false;
  lastDamagedBy: string;
  swappingWeapons: boolean = false;
  justFired: boolean = false;
  justMeleed: boolean = false;
  canShoot: boolean = true;
  crouched: boolean = false;
  sprinting: boolean = false;
  moveSpeed: number; // WASD
  cameraAngularSensibility: number; // controls mouse speed
  cameraInertia: number; // controls mouse 'smoothness'
  selectingMesh: Mesh = null;
  private _nextPosition: Vector3;
  private _nextRotation: Vector3;

  constructor(_id?: string, sessionId?: string, username?: string, name?: string) {
    this._id = _id;
    this.sessionId = sessionId;
    this.username = username;
    this.name = name;
  }

  get position(): Vector3 {
    return this.playerMesh?.position;
  }

  set position(vector3: Vector3) {
    if (this.playerMesh.position) this.playerMesh.position.set(vector3.x, vector3.y, vector3.z);
    else this.playerMesh.position = vector3;
  }

  get nextPosition(): Vector3 {
    return this._nextPosition;
  }

  set nextPosition(vector3: Vector3) {
    if (this._nextPosition) this._nextPosition.set(vector3.x, vector3.y, vector3.z);
    else this._nextPosition = vector3;
  }

  get rotation(): Vector3 {
    return this.playerMesh?.rotation;
  }

  set rotation(vector3: Vector3) {
    if (this.playerMesh.rotation) this.playerMesh.rotation.set(vector3.x, vector3.y, vector3.z);
    else this.playerMesh.rotation = vector3;
  }

  get nextRotation(): Vector3 {
    return this._nextRotation;
  }

  set nextRotation(vector3: Vector3) {
    if (this._nextRotation) this._nextRotation.set(vector3.x, vector3.y, vector3.z);
    else this._nextRotation = vector3;
  }

  async importPlayerMesh(scene: Scene): Promise<Mesh> {
    this.playerMesh = (await SceneLoader.ImportMeshAsync('', this.playerMeshURL, '', scene)).meshes[0] as Mesh;
    this.playerMesh.id = this._id;
    this.playerMesh.name = this.name;
    return this.playerMesh;

  }

  async importMeleeSound(scene: Scene): Promise<Sound> {
    this.meleeSound = new Sound('', this.meleeSoundURL, scene, null);
    this.meleeSound.name = this.name + '-MeleeSound';
    return this.meleeSound;
  }

  getActiveWeapon(): Gun {
    if (this.activeWeaponName == this.primaryWeapon.name) return this.primaryWeapon;
    else if (this.activeWeaponName == this.secondaryWeapon.name) return this.secondaryWeapon;
    return null;
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

  createMeleeWeapon(scene: Scene) {
    let cube = MeshBuilder.CreateBox('cube', {size: 3}, scene);
    let mat = new StandardMaterial('primary', scene);
    mat.diffuseColor = Color3.Red();

    // get the gun in a world position that is good for baking the verticies
    cube.position = new Vector3(3, -4, 20);
    cube.rotationQuaternion = null;
    cube.rotation = new Vector3(0, 0, 0);
    cube.material = mat;
    cube.isPickable = false;
    cube.visibility = 0;
    for (let i = 0; i < cube.getChildMeshes().length; i++) cube.getChildMeshes()[i].isPickable = false;

    // make new default 0,0,0 settings so that the gun can rotate 'properly' relative to the camera
    cube.bakeCurrentTransformIntoVertices(); 

    this.meleeWeapon = cube;
  }

  dispose() {
    this.playerMesh?.dispose();
    this.meleeSound?.dispose();
  }

}
