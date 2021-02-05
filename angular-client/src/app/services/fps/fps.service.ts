import { Injectable, ElementRef } from '@angular/core';
import { UniversalCamera, Camera, SceneLoader, Sound, Mesh, StandardMaterial, Vector3, Color3, Scene, Ray, RayHelper, PickingInfo } from '@babylonjs/core';
import { TextBlock, AdvancedDynamicTexture, Control, Rectangle } from '@babylonjs/gui';

// Services/Models
import { GunService } from 'src/app/services/gun/gun.service';
import { Gun } from 'src/app/models/gun/gun';
import { PlayerService } from 'src/app/services/player/player.service';
import { Player } from 'src/app/models/player/player';

@Injectable({
  providedIn: 'root'
})
export class FpsService {

  camera: UniversalCamera;
  scene: Scene;
  canvas: ElementRef<HTMLCanvasElement>;

  self: Player;
  enemy: Player;

  gunSightCamera: UniversalCamera;
  gunSight: Mesh;
  hitMarkerSight: Mesh;
  hitMarkerSound: Sound;
  hitMarkerSoundURL: string = 'assets/babylon/sounds/m4/hit-marker.mp3';

  shoot: boolean;
  justFired: boolean = false;
  isSceneLocked: boolean = false;

  // HUD STUFF
  hud: AdvancedDynamicTexture;
  ammo: TextBlock;
  health: TextBlock;
  rectangle: Rectangle;

  constructor(private gunService: GunService, private playerService: PlayerService) { }

  async addFpsMechanics(scene: Scene, canvas: ElementRef<HTMLCanvasElement>) {
    this.camera = scene.activeCamera as UniversalCamera;
    this.scene = scene;
    this.canvas = canvas;

    this.createFpsCamera();
    this.createFpsKeyBinds();
    this.addCrossHairs();
    this.addHitMarkerSound();
    this.handlePointerEvents();
    await this.createPlayer();
    await this.getWeapons();
    await this.createEnemy();
    this.handlePlayerAndWeaponPosition();
    this.createHUD();
    this.handleHealth();
  }

  async createPlayer() {
    this.self = new Player();
    this.self.playerMesh = null;
    this.self.playerMeshURL = 'assets/babylon/models/dude/dude.babylon';
    this.self.playerSound = null;
    this.self.playerSoundURL = '';
    this.self.name = 'self';
    this.self.type = 'self';
    this.self.primaryWeapon = null;
    this.self.secondaryWeapon = null;
    this.self.health = 100;
    this.self.moveSpeed = 0;
    this.self.cameraAngularSensibility = this.camera.angularSensibility; 
    this.self.cameraInertia = this.camera.inertia; 

    await this.playerService.create(this.self, this.scene);

    for (let i = 0; i < this.self.playerMesh.getChildMeshes().length; i++) this.self.playerMesh.getChildMeshes()[i].layerMask = 0x10000000; // make dude and dude nodes invisible to main fps camera
    this.self.playerMesh.position = new Vector3(0, -64, -5); // offset dude back in the Z direction and down in the Y direction by the height of the camera elipsoid
    this.self.playerMesh.bakeCurrentTransformIntoVertices(); // make new default 0,0,0 position

  }

  async createEnemy() {
    this.enemy = new Player();
    this.enemy.playerMesh = null;
    this.enemy.playerMeshURL = 'assets/babylon/models/dude/dude.babylon';
    this.enemy.playerSound = null;
    this.enemy.playerSoundURL = '';
    this.enemy.name = 'enemy';
    this.enemy.type = 'enemy';
    this.enemy.primaryWeapon = null;
    this.enemy.secondaryWeapon = null;
    this.enemy.health = 100;
    this.enemy.moveSpeed = 0;
    this.enemy.cameraAngularSensibility = this.camera.angularSensibility; 
    this.enemy.cameraInertia = this.camera.inertia; 

    await this.playerService.create(this.enemy, this.scene);

    this.enemy.playerMesh.getChildMeshes()[0].name = 'enemyHead';
    this.enemy.playerMesh.getChildMeshes()[1].name = 'enemyTorso';
    this.enemy.playerMesh.getChildMeshes()[2].name = 'enemyLegs';
    this.enemy.playerMesh.getChildMeshes()[3].name = 'enemyArmsOrGroin';
    this.enemy.playerMesh.getChildMeshes()[4].name = 'enemyEyes';

  }

  async getWeapons() {
    this.self.primaryWeapon = await this.gunService.get('m4', this.scene);
    this.self.secondaryWeapon = await this.gunService.get('fake', this.scene);

    // get the gun in a world position that is good for baking the verticies
    this.self.primaryWeapon.gunMesh.position = new Vector3(4, -6, 20);
    this.self.primaryWeapon.gunMesh.scaling = new Vector3(.25, .25, .25);

    // make new default 0,0,0 settings so that the gun can rotate 'properly' relative to the camera
    this.self.primaryWeapon.gunMesh.bakeCurrentTransformIntoVertices(); 

    // get the gun in a world position that is good for baking the verticies
    this.self.secondaryWeapon.gunMesh.position = new Vector3(0, 0, 0);
    this.self.secondaryWeapon.gunMesh.scaling = new Vector3(.02, .02, .02); 
    this.self.secondaryWeapon.gunMesh.rotation = new Vector3(1, 3, -1);

    // // make new default 0,0,0 settings so that the gun can rotate 'properly' relative to the camera 
    //CAUSES ROTATION BUG ON PRIMARY
    // this.self.secondaryWeapon.gunMesh.bakeCurrentTransformIntoVertices(); 


  }

  handlePlayerAndWeaponPosition() {
    this.scene.afterCameraRender = () => {
      this.self.playerMesh.position = this.camera.position;
      this.self.playerMesh.rotation = this.camera.rotation;
      this.self.primaryWeapon.gunMesh.position = this.camera.position;
      this.self.primaryWeapon.gunMesh.rotation = this.camera.rotation;
    };

    // this.scene.onAfterRenderObservable.add(() => {
    //   this.self.primaryWeapon.gunMesh.position = this.camera.position;
    //   this.self.primaryWeapon.gunMesh.rotation = this.camera.rotation;
    // });

    // this.scene.afterRender = () => {
    //   this.self.primaryWeapon.gunMesh.position = this.camera.position;
    //   this.self.primaryWeapon.gunMesh.rotation = this.camera.rotation;
    // };
  }

  createHUD() {
    this.hud = AdvancedDynamicTexture.CreateFullscreenUI('HUD');
    this.hud.idealHeight = 720;

    this.rectangle = new Rectangle();
    this.rectangle.name = 'rectangle';
    this.rectangle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.rectangle.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.rectangle.width = "160px";
    this.rectangle.height = "90px";
    this.rectangle.cornerRadius = 20;
    this.rectangle.color = "blue";
    this.rectangle.thickness = 2;
    this.rectangle.background = "grey";
    this.rectangle.top = '600px';
    this.rectangle.left = '-57px';
    this.hud.addControl(this.rectangle);  

    this.ammo = new TextBlock();
    this.ammo.name = 'ammo count';
    this.ammo.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
    this.ammo.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.ammo.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.ammo.fontSize = '30px';
    this.ammo.color = 'white';
    this.ammo.text = this.self.primaryWeapon.ammo + ' / ' + this.self.primaryWeapon.magazine;
    this.ammo.top = '650px';
    this.ammo.left = '-64px';
    this.ammo.width = '25%';
    this.ammo.fontFamily = 'Courier New';
    this.ammo.resizeToFit = true;
    this.hud.addControl(this.ammo);
    this.scene.onBeforeRenderObservable.add(() => this.updateAmmoCount());

    this.health = new TextBlock();
    this.health.name = 'health';
    this.health.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
    this.health.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.health.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.health.fontSize = '30px';
    this.health.color = 'green';
    this.health.text = 'HP: ' + this.self.health + '%';
    this.health.top = '600px';
    this.health.left = '-64px';
    this.health.width = '25%';
    this.health.fontFamily = 'Courier New';
    this.health.resizeToFit = true;
    this.hud.addControl(this.health);
    this.scene.onBeforeRenderObservable.add(() => this.updateHealth());

  }

  updateAmmoCount(): void {
    if (this.self.primaryWeapon.ammo == 0) this.ammo.color = 'red';
    if (this.self.primaryWeapon.ammo <= 5 && this.self.primaryWeapon.ammo > 0) this.ammo.color = 'yellow';
    if (this.self.primaryWeapon.ammo > 5) this.ammo.color = 'white';
    this.ammo.text = this.self.primaryWeapon.ammo + ' / ' + this.self.primaryWeapon.magazine;
  }

  updateHealth(): void {
    if (this.self.health <= 10) this.health.color = 'red';
    if (this.self.health <= 25) this.health.color = 'yellow';
    if (this.self.health > 25) this.health.color = 'green';
    this.health.text = 'HP: ' +  this.self.health + '%';
  }

  createFpsCamera() {
    this.camera.checkCollisions = true;
    this.camera.applyGravity = true;
    this.camera.ellipsoid = new Vector3(5, 32, 5);

    this.camera.keysUp = [];
    this.camera.keysUp.push('w'.charCodeAt(0));
    this.camera.keysUp.push('W'.charCodeAt(0));

    this.camera.keysUpward.push(' '.charCodeAt(0)); // registers an input to apply gravity 

    this.camera.keysLeft = [];
    this.camera.keysLeft.push('a'.charCodeAt(0));
    this.camera.keysLeft.push('A'.charCodeAt(0));

    this.camera.keysDown = [];
    this.camera.keysDown.push('s'.charCodeAt(0));
    this.camera.keysDown.push('S'.charCodeAt(0));

    this.camera.keysRight = [];
    this.camera.keysRight.push('d'.charCodeAt(0));
    this.camera.keysRight.push('D'.charCodeAt(0));

    this.camera.speed = 50; // controls WASD speed
    this.camera.angularSensibility = 5000; // controls mouse speed
    this.camera.inertia = .2; // controls 'smoothness'
  }

  addCrossHairs() {
		if (this.scene.activeCameras.length === 0) this.scene.activeCameras.push(this.scene.activeCamera);        

		this.gunSightCamera = new UniversalCamera('gunSightCamera', new Vector3(0, 0, -50), this.scene);                
		this.gunSightCamera.mode = Camera.ORTHOGRAPHIC_CAMERA;
		this.gunSightCamera.layerMask = 0x20000000;
		this.scene.activeCameras.push(this.gunSightCamera);
		
		let meshes = [];
		let h = 250;
		let w = 250;
		
		let y = Mesh.CreateBox('y', h * .2, this.scene);
		y.scaling = new Vector3(0.05, 1, 1);
		y.position = new Vector3(0, 0, 0);
		meshes.push(y);
		
		let x = Mesh.CreateBox('x', h * .2, this.scene);
		x.scaling = new Vector3(1, 0.05, 1);
		x.position = new Vector3(0, 0, 0);
		meshes.push(x);
		    
		let lineTop = Mesh.CreateBox('lineTop', w * .8, this.scene);
		lineTop.scaling = new Vector3(1, 0.005, 1);
		lineTop.position = new Vector3(0, h * 0.5, 0);
		meshes.push(lineTop);
		
		let lineBottom = Mesh.CreateBox('lineBottom', w * .8, this.scene);
		lineBottom.scaling = new Vector3(1, 0.005, 1);
		lineBottom.position = new Vector3(0, h * -0.5, 0);
		meshes.push(lineBottom);
		
		let lineLeft = Mesh.CreateBox('lineLeft', h, this.scene);
		lineLeft.scaling = new Vector3(0.010, 1,  1);
		lineLeft.position = new Vector3(w * -.4, 0, 0);
		meshes.push(lineLeft);
		
		let lineRight = Mesh.CreateBox('lineRight', h, this.scene);
		lineRight.scaling = new Vector3(0.010, 1,  1);
		lineRight.position = new Vector3(w * .4, 0, 0);
		meshes.push(lineRight);
		
    this.gunSight = Mesh.MergeMeshes(meshes);
		this.gunSight.name = 'gunSight';
		this.gunSight.layerMask = 0x20000000;
		this.gunSight.freezeWorldMatrix();
		
		let gunSightMat = new StandardMaterial('gunSightMat', this.scene);
		gunSightMat.checkReadyOnlyOnce = true;
		gunSightMat.emissiveColor = new Color3(0,1,0);
		
    this.gunSight.material = gunSightMat;
    this.gunSight.isPickable = false;

    // create hitmarker off of gunsight
		let hitMarkerMat = new StandardMaterial('hitMarkerMat', this.scene);
		hitMarkerMat.checkReadyOnlyOnce = true;
    hitMarkerMat.emissiveColor = new Color3(1,0,0);
    
    this.hitMarkerSight = this.gunSight.clone('hitMarker');
    this.hitMarkerSight.material = hitMarkerMat;
    this.hitMarkerSight.rotation = new Vector3(0, 0, .8);
    this.hitMarkerSight.scaling = new Vector3(.6, .6, 1);
    this.hitMarkerSight.visibility = 0;
  }
  
  async addHitMarkerSound(): Promise<Sound> {
    
    // import the sound
    this.hitMarkerSound = new Sound('', this.hitMarkerSoundURL, this.scene, null);
    this.hitMarkerSound.setVolume(1);
    this.hitMarkerSound.name = 'hitMarkerSound';

    return this.hitMarkerSound;
  }

  createFpsKeyBinds() {
    this.handleRunOnShift();
    this.handleFlyOnSpace();
    this.handleReloadOnR();
  }

  handleRunOnShift() {
    document.addEventListener('keydown', event => { if (this.isSceneLocked && event.code == 'ShiftLeft') this.camera.speed = 70 });
    document.addEventListener('keyup', event => { if (this.isSceneLocked && event.code == 'ShiftLeft') this.camera.speed = 50 });
  }

  handleFlyOnSpace() {
    document.addEventListener('keydown', event => { if (this.isSceneLocked && event.code == 'Space') this.camera.applyGravity = !this.camera.applyGravity });
  }

  handleReloadOnR() {
    document.addEventListener('keydown', event => { if (this.isSceneLocked && event.code == 'KeyR' && !this.self.primaryWeapon.reloadSound.isPlaying && this.self.primaryWeapon.ammo < this.self.primaryWeapon.magazine) this.reloadWeapon() });
  }

  handlePointerEvents() {
   
    // Hide and lock mouse cursor when scene is clicked
    this.scene.onPointerDown = (event) => { 
      if (!this.isSceneLocked) this.canvas.nativeElement.requestPointerLock(); // lock the screen if left mouse clicked and screen not locked
      else if (this.isSceneLocked && event.button == 0) this.fireWeapon(); // screen is locked...fire weapon
    };

    this.scene.onPointerUp = (event) => { if (event.button == 0) this.shoot = false };

    // Toggle state of pointer lock so that requestPointerLock does not get called repetitively and handle window state
    this.handlePointerLockChange();
  }

  fireWeapon() {
    let currentAmmo = this.self.primaryWeapon.ammo;
    this.shoot = true;
    // Returns a Promise that resolves after 'ms' Milliseconds
    const timer = ms => new Promise(res => setTimeout(res, ms));

    let fire = async () => { // We need to wrap the loop into an async function for this to work

      // cant fire if reloading or if you just fired
      if (!this.self.primaryWeapon.reloadSound.isPlaying && !this.justFired) {
        for (let i = 0; i < currentAmmo; i++) {
          if (this.shoot && !this.self.primaryWeapon.reloadSound.isPlaying) {
            this.self.primaryWeapon.gunshotSound.play(); 
            this.self.primaryWeapon.ammo--; 
            this.justFired = true; // set just fired to true to prevent spam fire
            setTimeout(() => this.justFired = false, this.self.primaryWeapon.fireRate) // set just fired back to false on a delayed timer that equals the weapons firerate
            this.castRay();
          }
          else 
            break;
          
          await timer(this.self.primaryWeapon.fireRate); // then the created Promise can be awaited
        }
        if (this.self.primaryWeapon.ammo <= 0) this.reloadWeapon();
      }
    }

    fire(); 
  }

  reloadWeapon() {
    this.self.primaryWeapon.reloadSound.play();
    this.self.primaryWeapon.reloadSound.onEndedObservable.add(() => this.self.primaryWeapon.ammo = this.self.primaryWeapon.magazine);
  }

  castRay() {
    
    let origin = this.camera.position; 
    let length = 50000;
    let wm = this.camera.getWorldMatrix();
    let aimVector = Vector3.TransformNormal(Vector3.Forward(), wm).normalize();

    // Make the gun mesh and its children unpickable so the ray doesnt accidentally pick the gun meshes
    this.self.primaryWeapon.gunMesh.isPickable = false;
    this.self.primaryWeapon.gunMesh.getChildMeshes()[0].isPickable = false;
    this.self.primaryWeapon.gunMesh.getChildMeshes()[1].isPickable = false;

    let ray = new Ray(origin, aimVector, length);
    let rayHelper = new RayHelper(ray);
    rayHelper.show(this.scene, Color3.Blue());

    // log picked
    let pickingInfo = this.scene.pickWithRay(ray);
    if (pickingInfo.pickedMesh != null && (pickingInfo.pickedMesh.name == 'sphere' || pickingInfo.pickedMesh.name.indexOf('enemy') >=  0)) {
      this.hitMarkerSound.play();
      this.hitMarkerSight.visibility = 1;
      setTimeout(() => this.hitMarkerSight.visibility = 0, 65);
      this.targetHit(pickingInfo);
    }

  }

  targetHit(pickingInfo: PickingInfo) {
    if (pickingInfo.pickedMesh.parent.name == 'enemy') {
      let enemy = this.playerService.get(pickingInfo.pickedMesh.parent.name);
      enemy.health-= 10;
      console.log(this.enemy.health);
    }

  }

  handleHealth() {
    this.scene.onAfterRenderObservable.add(() => {
      if (this.enemy.health <= 0) {
        this.enemy.playerMesh.dispose()
      }
    });
  }


  handlePointerLockChange() {
     // Toggle state of pointer lock so that requestPointerLock does not get called repetitively and handle window state
     document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement) {
        this.isSceneLocked = true;
        this.unloadScrollBars();
        this.scrollWindowToBottom();
      }
      else {
        this.isSceneLocked = false;
        this.reloadScrollBars();
        this.scrollWindowToTop();
      }
    });  
  }

  reloadScrollBars() {
    document.documentElement.style.overflow = 'auto';  // firefox, chrome
  }

  unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
  }

  scrollWindowToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  scrollWindowToTop() {
    window.scrollTo(0, 0);
  }

}
