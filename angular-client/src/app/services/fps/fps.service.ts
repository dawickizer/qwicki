import { Injectable, ElementRef } from '@angular/core';
import { UniversalCamera, Camera, Sound, Mesh, StandardMaterial, BoundingInfo, Vector3, Color3, Scene, Ray } from '@babylonjs/core';
import { TextBlock, AdvancedDynamicTexture, Control } from '@babylonjs/gui';

// Services/Models
import { GunService } from 'src/app/services/gun/gun.service';
import { Gun } from 'src/app/models/gun/gun';

@Injectable({
  providedIn: 'root'
})
export class FpsService {

  camera: UniversalCamera;
  scene: Scene;
  canvas: ElementRef<HTMLCanvasElement>;
  gunSight: Mesh;
  hitMarkerSight: Mesh;
  hitMarkerSound: Sound;
  hitMarkerSoundURL: string = 'assets/babylon/sounds/m4/hit-marker.mp3';
  gun: Gun;
  guns: Gun[];
  shoot: boolean;
  justFired: boolean = false;
  isSceneLocked: boolean = false;

  // HUD STUFF
  hud: AdvancedDynamicTexture;
  ammo: TextBlock;

  constructor(private gunService: GunService) { }

  async addFpsMechanics(camera: UniversalCamera, scene: Scene, canvas: ElementRef<HTMLCanvasElement>) {
    this.camera = camera;
    this.scene = scene;
    this.canvas = canvas;

    this.guns = await this.gunService.getAll(this.scene);
    this.gun = this.guns[0];

    this.createFpsCamera();
    this.lockGunToCamera(4, -35, 20);
    this.addCrossHairs();
    await this.addHitMarkerSound();
    this.createFpsKeyBinds();
    this.handlePointerEvents();
    this.createHUD();



    //play 
    this.guns[1].gunMesh.position = new Vector3(50, 2, 50);
    this.guns[1].gunMesh.rotation = new Vector3(0, 0, 1.5);

    this.guns[0].gunMesh.setBoundingInfo(new BoundingInfo(new Vector3(-2, -20, -20.5), new Vector3(2, 5, 20.5)));
    this.guns[1].gunMesh.setBoundingInfo(new BoundingInfo(new Vector3(-2, -10, -20.5), new Vector3(2, 5, 20.5)));

    
  }

  createHUD() {
    this.hud = AdvancedDynamicTexture.CreateFullscreenUI('HUD');
    this.hud.idealHeight = 720;

    this.ammo = new TextBlock();
    this.ammo.name = 'ammo count';
    this.ammo.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
    this.ammo.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.ammo.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.ammo.fontSize = '22px';
    this.ammo.color = 'white';
    this.ammo.text = this.gun.ammo + ' / ' + this.gun.magazine;
    this.ammo.top = '650px';
    this.ammo.left = '-64px';
    this.ammo.width = '25%';
    this.ammo.fontFamily = 'Courier New';
    this.ammo.resizeToFit = true;
    this.hud.addControl(this.ammo);

    this.scene.onBeforeRenderObservable.add(() => this.updateAmmoCount());
  }

  updateAmmoCount(): void {
    if (this.gun.ammo == 0) this.ammo.color = 'red';
    if (this.gun.ammo <= 5 && this.gun.ammo > 0) this.ammo.color = 'yellow';
    if (this.gun.ammo > 5) this.ammo.color = 'white';
    this.ammo.text = this.gun.ammo + ' / ' + this.gun.magazine;
  }

  createFpsCamera() {
    this.camera.checkCollisions = true;
    this.camera.applyGravity = true;
    this.camera.ellipsoid = new Vector3(5,15,5);

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

  lockGunToCamera(xOffset: number, yOffset: number, zOffset: number) {
    this.gun.gunMesh.position = new Vector3(this.camera.position.x + xOffset, this.camera.position.y + yOffset, this.camera.position.z + zOffset);
    this.gun.gunMesh.parent = this.camera;
  }

  addCrossHairs() {
		if (this.scene.activeCameras.length === 0) this.scene.activeCameras.push(this.scene.activeCamera);        

		let secondCamera = new UniversalCamera('GunSightCamera', new Vector3(0, 0, -50), this.scene);                
		secondCamera.mode = Camera.ORTHOGRAPHIC_CAMERA;
		secondCamera.layerMask = 0x20000000;
		this.scene.activeCameras.push(secondCamera);
		
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
    document.addEventListener('keydown', event => { if (this.isSceneLocked && event.code == 'KeyR' && !this.gun.reloadSound.isPlaying && this.gun.ammo < this.gun.magazine) this.reloadWeapon() });
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
    let currentAmmo = this.gun.ammo;
    this.shoot = true;
    // Returns a Promise that resolves after 'ms' Milliseconds
    const timer = ms => new Promise(res => setTimeout(res, ms));

    let fire = async () => { // We need to wrap the loop into an async function for this to work

      // cant fire if reloading or if you just fired
      if (!this.gun.reloadSound.isPlaying && !this.justFired) {
        for (let i = 0; i < currentAmmo; i++) {
          if (this.shoot && !this.gun.reloadSound.isPlaying) {
            this.gun.gunshotSound.play(); 
            this.gun.ammo--; 
            this.justFired = true; // set just fired to true to prevent spam fire
            setTimeout(() => this.justFired = false, this.gun.fireRate) // set just fired back to false on a delayed timer that equals the weapons firerate
            this.castRay();
          }
          else 
            break;
          
          await timer(this.gun.fireRate); // then the created Promise can be awaited
        }
        if (this.gun.ammo <= 0) this.reloadWeapon();
      }
    }

    fire(); 
  }

  reloadWeapon() {
    this.gun.reloadSound.play();
    this.gun.reloadSound.onEndedObservable.add(() => this.gun.ammo = this.gun.magazine);
  }

  castRay() {
      
    let origin = this.camera.position; // set origin to center of gun mesh
    let length = 50000;

    // dont understand this lol
    let wm = this.camera.getWorldMatrix();
    let aimVector = Vector3.TransformCoordinates(Vector3.Forward(), wm)
      .subtract(this.camera.position)
      .normalize();
  
    // Make the gun mesh and its children unpickable so the ray doesnt accidentally pick the gun meshes
    this.gun.gunMesh.isPickable = false;
    this.gun.gunMesh.getChildMeshes()[0].isPickable = false;
    this.gun.gunMesh.getChildMeshes()[1].isPickable = false;

    let ray = new Ray(origin, aimVector, length);

    // log picked
    let pickInfo = this.scene.pickWithRay(ray);
    if (pickInfo.pickedMesh != null) console.log(pickInfo.pickedMesh.name);
    if (pickInfo.pickedMesh != null && pickInfo.pickedMesh.name == 'sphere') {
      this.hitMarkerSound.play();
      this.hitMarkerSight.visibility = 1;
      setTimeout(() => this.hitMarkerSight.visibility = 0, 65);
    }

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
