import { Injectable, ElementRef } from '@angular/core';
import { UniversalCamera, Camera, Sound, Mesh, StandardMaterial, Vector3, Color3, Scene, Ray } from '@babylonjs/core';
import { TextBlock, AdvancedDynamicTexture, Control } from '@babylonjs/gui';

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
  enemies: Player[] = [];

  spareWeapon: Gun;

  gunSightCamera: UniversalCamera;
  gunSight: Mesh;
  reloadingSight: Mesh;
  hitMarkerSight: Mesh;
  hitMarkerSound: Sound;
  hitMarkerSoundURL: string = 'assets/babylon/sounds/m4/hit-marker.mp3';
  isSceneLocked: boolean = false;
  swapWeaponCooldown: number = 500;

  killLogs: string[] = [];

  // HUD STUFF
  hud: AdvancedDynamicTexture;
  killLogsDisplay: TextBlock[] = [];
  ammo: TextBlock;
  health: TextBlock;

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
    this.handleSideNavKeyBind();
    await this.createPlayer();
    await this.createWeapons();
    let names = ['Arshmazing', 'Senjoku', 'krookYa', 'cpt_crispy', 'hodoo', 'juri'];
    for (let i = 0; i < 6; i++) this.enemies.push(await this.createEnemy(names[i]));
    this.setEnemyPositions();
    this.handlePlayerAndWeaponPosition();
    this.createHUD();
    this.handleHealth();
  }

  async createPlayer() {
    this.self = new Player('McWickyyyy', 'self');
    this.self.playerMeshURL = 'assets/babylon/models/dude/dude.babylon';
    this.self.playerSoundURL = '';
    this.self.moveSpeed = this.camera.speed;
    this.self.cameraAngularSensibility = this.camera.angularSensibility; 
    this.self.cameraInertia = this.camera.inertia; 

    await this.playerService.create(this.self, this.scene);

    this.self.createSelectingMesh(this.scene, this.camera);

    for (let i = 0; i < this.self.playerMesh.getChildMeshes().length; i++) this.self.playerMesh.getChildMeshes()[i].layerMask = 0x10000000; // make dude and dude nodes invisible to main fps camera
    this.self.playerMesh.position = new Vector3(0, -64, -5); // offset dude back in the Z direction and down in the Y direction by the height of the camera elipsoid
    this.self.playerMesh.bakeCurrentTransformIntoVertices(); // make new default 0,0,0 position

  }

  async createEnemy(userId: string): Promise<Player> {
    let enemy = new Player(userId, 'enemy');
    enemy.playerMeshURL = 'assets/babylon/models/dude/dude.babylon';
    enemy.playerSoundURL = '';
    enemy.moveSpeed = this.camera.speed;
    enemy.cameraAngularSensibility = this.camera.angularSensibility; 
    enemy.cameraInertia = this.camera.inertia; 

    await this.playerService.create(enemy, this.scene);

    enemy.playerMesh.getChildMeshes()[0].name = 'enemy-head';
    enemy.playerMesh.getChildMeshes()[1].name = 'enemy-torso';
    enemy.playerMesh.getChildMeshes()[2].name = 'enemy-legs';
    enemy.playerMesh.getChildMeshes()[3].name = 'enemy-armsOrGroin';
    enemy.playerMesh.getChildMeshes()[4].name = 'enemy-eyes';

    return enemy;
  }

  setEnemyPositions() {
    for (let i = 1; i < this.enemies.length; i++) this.enemies[i].playerMesh.position = this.enemies[i - 1].playerMesh.position.add(new Vector3(100, 0, 0))
  }

  async createWeapons() {

    // create m4
    let m4 = new Gun();
    m4.gunMeshURL = 'assets/babylon/models/m4/scene.gltf';
    m4.gunshotSoundURL = 'assets/babylon/sounds/m4/gunshot.mp3';
    m4.reloadSoundURL = 'assets/babylon/sounds/m4/reload.mp3';
    m4.cockingSoundURL = 'assets/babylon/sounds/m4/m4-cocking.mp3';
    m4.name = 'm4';
    m4.magazine = 30;
    m4.ammo = 30;
    m4.fireRate = 65;
    m4.fireType = 'auto';
    m4.damage = 20;

    // create mp5
    let mp5 = new Gun();
    mp5.gunMeshURL = 'assets/babylon/models/mp5/scene.gltf';
    mp5.gunshotSoundURL = 'assets/babylon/sounds/mp5/silencer.mp3';
    mp5.reloadSoundURL = 'assets/babylon/sounds/mp5/reload.mp3';
    mp5.cockingSoundURL = 'assets/babylon/sounds/mp5/mp5-cocking.mp3';
    mp5.name = 'mp5';
    mp5.magazine = 25;
    mp5.ammo = 25;
    mp5.fireRate = 65;
    mp5.fireType = 'auto';
    mp5.damage = 10;

    // create g3
    let g3 = new Gun();
    g3.gunMeshURL = 'assets/babylon/models/m4/scene.gltf';
    g3.gunshotSoundURL = 'assets/babylon/sounds/m4/gunshot.mp3';
    g3.reloadSoundURL = 'assets/babylon/sounds/m4/reload.mp3';
    g3.cockingSoundURL = 'assets/babylon/sounds/m4/m4-cocking.mp3';
    g3.name = 'g3';
    g3.magazine = 15;
    g3.ammo = 15;
    g3.fireRate = 300;
    g3.fireType = 'auto';
    g3.damage = 30;

    // this.self.primaryWeapon = await this.gunService.create(m4, this.scene);
    // this.self.activeWeaponName = this.self.primaryWeapon.name;
    // this.self.secondaryWeapon = await this.gunService.create(mp5, this.scene);

    // // get the gun in a world position that is good for baking the verticies
    // this.self.primaryWeapon.gunMesh.position = new Vector3(4, -6, 20);
    // this.self.primaryWeapon.gunMesh.scaling = new Vector3(.25, .25, -.25);
    // this.self.primaryWeapon.gunMesh.rotationQuaternion = null;
    // this.self.primaryWeapon.gunMesh.rotation = new Vector3(0, 0, 0);
    // this.self.primaryWeapon.gunMesh.isPickable = false;
    // for (let i = 0; i < this.self.primaryWeapon.gunMesh.getChildMeshes().length; i++) this.self.primaryWeapon.gunMesh.getChildMeshes()[i].isPickable = false;

    // // make new default 0,0,0 settings so that the gun can rotate 'properly' relative to the camera
    // this.self.primaryWeapon.gunMesh.bakeCurrentTransformIntoVertices(); 

    // // get the gun in a world position that is good for baking the verticies
    // this.self.secondaryWeapon.gunMesh.position = new Vector3(4, -8, 18);
    // this.self.secondaryWeapon.gunMesh.scaling = new Vector3(.03, .03, .03); 
    // this.self.secondaryWeapon.gunMesh.rotationQuaternion = null;
    // this.self.secondaryWeapon.gunMesh.rotation = new Vector3(0, -1.55, 0);
    // this.self.secondaryWeapon.gunMesh.isPickable = false;
    // this.self.secondaryWeapon.gunshotSound.setVolume(.25);
    // for (let i = 0; i < this.self.secondaryWeapon.gunMesh.getChildMeshes().length; i++) this.self.secondaryWeapon.gunMesh.getChildMeshes()[i].isPickable = false;

    // // make new default 0,0,0 settings so that the gun can rotate 'properly' relative to the camera 
    // // CAUSES ROTATION BUG ON PRIMARY
    // //this.self.secondaryWeapon.gunMesh.bakeCurrentTransformIntoVertices();  

    // FOR NOW JUST USE BASIC MESHES WITH THE FAKE GUN CREATER
    this.self.primaryWeapon = await this.gunService.createFake(m4, this.scene, 'primary');
    this.self.activeWeaponName = this.self.primaryWeapon.name;
    this.self.secondaryWeapon = await this.gunService.createFake(mp5, this.scene, 'secondary');
    this.self.secondaryWeapon.gunMesh.visibility = 0;
    this.self.secondaryWeapon.gunshotSound.setVolume(.25);

    // create spare gun
    this.spareWeapon = await this.gunService.createFake(g3, this.scene, 'spare');
    this.spareWeapon.gunMesh.position = new Vector3(0, 10, 50);
  }

  handlePlayerAndWeaponPosition() {
    this.scene.afterCameraRender = () => {
      this.self.playerMesh.position = this.camera.position;
      this.self.playerMesh.rotation = this.camera.rotation;

      this.self.getActiveWeapon().gunMesh.position = this.camera.position;
      this.self.getActiveWeapon().gunMesh.rotation = this.camera.rotation;

      if (this.self.selectingMesh.intersectsMesh(this.spareWeapon.gunMesh)) {
        console.log('pickup ' +  this.spareWeapon.name + '?')
      }
    };
  }

  createHUD() {
    this.hud = AdvancedDynamicTexture.CreateFullscreenUI('HUD');
    this.hud.idealHeight = 720;

    this.ammo = new TextBlock();
    this.ammo.name = 'ammo count';
    this.ammo.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
    this.ammo.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.ammo.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.ammo.fontSize = '30px';
    this.ammo.color = 'white';
    this.ammo.text = this.self.getActiveWeapon().ammo + ' / ' + this.self.getActiveWeapon().magazine;
    this.ammo.top = '650px';
    this.ammo.left = '-64px';
    this.ammo.width = '25%';
    this.ammo.fontFamily = 'Courier New';
    this.ammo.resizeToFit = true;
    this.hud.addControl(this.ammo);

    this.health = new TextBlock();
    this.health.name = 'health';
    this.health.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
    this.health.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.health.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.health.fontSize = '30px';
    this.health.color = 'white';
    this.health.text = 'HP: ' + this.self.health + '%';
    this.health.top = '600px';
    this.health.left = '-64px';
    this.health.width = '25%';
    this.health.fontFamily = 'Courier New';
    this.health.resizeToFit = true;
    this.hud.addControl(this.health);
    this.scene.onBeforeRenderObservable.add(() => this.updateHealth()); // potentially update logic

    for (let i = 0; i < 4; i++) {
      let killLogDisplay = new TextBlock();
      killLogDisplay.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
      killLogDisplay.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
      killLogDisplay.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      killLogDisplay.fontSize = '15px';
      killLogDisplay.color = 'white';
      killLogDisplay.fontFamily = 'Courier New';
      killLogDisplay.text = '';
      killLogDisplay.topInPixels = 560 - (i*20);
      killLogDisplay.left = '-64px'; //1100 if HORIZONTAL_ALIGNMENT_LEFT
      killLogDisplay.width = '25%';;
      killLogDisplay.resizeToFit = true; 
      
      this.killLogsDisplay.push(killLogDisplay)
      this.hud.addControl(killLogDisplay);
    }

  }

  updateAmmoCount(): void {
    if (this.self.getActiveWeapon().ammo == 0) this.ammo.color = 'red';
    if (this.self.getActiveWeapon().ammo <= 5 && this.self.getActiveWeapon().ammo > 0) this.ammo.color = 'yellow';
    if (this.self.getActiveWeapon().ammo > 5) this.ammo.color = 'white';
    this.ammo.text = this.self.getActiveWeapon().ammo + ' / ' + this.self.getActiveWeapon().magazine;
  }

  updateHealth(): void {
    if (this.self.health <= 10) this.health.color = 'red';
    if (this.self.health <= 25) this.health.color = 'yellow';
    if (this.self.health > 25) this.health.color = 'white';
    this.health.text = 'HP: ' +  this.self.health + '%';
  }

  updateKillLogs(killLog: string): void {
    if (this.killLogs.length > 3) this.killLogs.pop();
    this.killLogs.unshift(killLog);
    setTimeout(() => {
    this.killLogs.pop();
    this.killLogsDisplay[this.killLogs.length].text = '';
    }, 4000)
    for (let i = 0; i < this.killLogs.length; i++) this.killLogsDisplay[i].text = this.killLogs[i];
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

  getCameraSensitivity(): number {
    return this.camera.angularSensibility;
  }

  setCameraSensitivity(cameraSensitivity: number) {
    this.camera.angularSensibility = cameraSensitivity;
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
		gunSightMat.emissiveColor = new Color3(1,1,1);
		
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

    // create reloading icon off of gunsight
		let reloadingMat = new StandardMaterial('reloadingMarkerMat', this.scene);
		reloadingMat.checkReadyOnlyOnce = true;
    reloadingMat.emissiveColor = new Color3(1,1,0);
    
    this.reloadingSight = this.gunSight.clone('hitMarker');
    this.reloadingSight.material = reloadingMat;
    this.reloadingSight.rotation = new Vector3(0, 0, .8);
    this.reloadingSight.scaling = new Vector3(.6, .6, 1);
    this.reloadingSight.visibility = 0;
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
    this.handleSwapWeaponOnF();
    this.handlePickupWeaponOnE();
  }

  handleRunOnShift() {
    document.addEventListener('keydown', event => { if (this.isSceneLocked && event.code == 'ShiftLeft') this.camera.speed = 70 });
    document.addEventListener('keyup', event => { if (this.isSceneLocked && event.code == 'ShiftLeft') this.camera.speed = 50 });
  }

  handleFlyOnSpace() {
    document.addEventListener('keydown', event => { if (this.isSceneLocked && event.code == 'Space') this.camera.applyGravity = !this.camera.applyGravity });
  }

  handleReloadOnR() {
    document.addEventListener('keydown', event => { if (this.isSceneLocked && event.code == 'KeyR' && !this.self.getActiveWeapon().reloadSound.isPlaying && this.self.getActiveWeapon().ammo < this.self.getActiveWeapon().magazine) this.reloadWeapon() });
  }

  handleSwapWeaponOnF() {
    document.addEventListener('keydown', event => { if (this.isSceneLocked && event.code == 'KeyF' && !this.self.swappingWeapons) this.swapWeapon() });
  }

  handlePickupWeaponOnE() {
    document.addEventListener('keydown', event => { if (this.isSceneLocked && event.code == 'KeyE' && this.self.selectingMesh.intersectsMesh(this.spareWeapon.gunMesh)) this.pickupWeapon() });
  }

  handlePointerEvents() {
   
    // Hide and lock mouse cursor when scene is clicked
    this.scene.onPointerDown = (event) => { 
      if (!this.isSceneLocked) this.canvas.nativeElement.requestPointerLock(); // lock the screen if left mouse clicked and screen not locked
      else if (this.isSceneLocked && event.button == 0) this.fireWeapon(); // screen is locked...fire weapon
    };

    this.scene.onPointerUp = (event) => { if (event.button == 0) this.self.canShoot = false };

    // Toggle state of pointer lock so that requestPointerLock does not get called repetitively and handle window state
    this.handlePointerLockChange();
  }

  pickupWeapon() { 
    console.log('trying to pick up weapon')
  }

  swapWeapon() {
    this.self.getActiveWeapon().reloadSound.stop();
    if (this.self.activeWeaponName == this.self.primaryWeapon.name) { 
      this.self.activeWeaponName = this.self.secondaryWeapon.name;
      this.self.primaryWeapon.gunMesh.visibility = 0;
      this.gunSight.visibility = 0;
      this.reloadingSight.visibility = 0;
      this.self.swappingWeapons = true;
      setTimeout(() => this.self.secondaryWeapon.cockingSound.play(), this.swapWeaponCooldown / 2);
      setTimeout(() => {
        this.self.swappingWeapons = false;
        this.self.secondaryWeapon.gunMesh.visibility = 1;
        this.gunSight.visibility = 1;
      }, this.swapWeaponCooldown);

    }
    else { 
      this.self.activeWeaponName = this.self.primaryWeapon.name;
      this.self.secondaryWeapon.gunMesh.visibility = 0;
      this.gunSight.visibility = 0;
      this.reloadingSight.visibility = 0;
      this.self.swappingWeapons = true;
      setTimeout(() => this.self.primaryWeapon.cockingSound.play(), this.swapWeaponCooldown / 2);
      setTimeout(() => {
        this.self.swappingWeapons = false;
        this.self.primaryWeapon.gunMesh.visibility = 1;
        this.gunSight.visibility = 1;
      }, this.swapWeaponCooldown);
    }
    this.updateAmmoCount()
  }

  fireWeapon() {
    let currentAmmo = this.self.getActiveWeapon().ammo;
    this.self.canShoot = true;
    // Returns a Promise that resolves after 'ms' Milliseconds
    const timer = ms => new Promise(res => setTimeout(res, ms));

    let fire = async () => { // We need to wrap the loop into an async function for this to work

      // cant fire if reloading or if you just fired
      if (!this.self.getActiveWeapon().reloadSound.isPlaying && !this.self.justFired && !this.self.swappingWeapons) {
        for (let i = 0; i < currentAmmo; i++) {
          if (this.self.canShoot && !this.self.getActiveWeapon().reloadSound.isPlaying && !this.self.swappingWeapons) {
            this.self.getActiveWeapon().gunshotSound.play(); 
            this.self.getActiveWeapon().ammo--; 
            this.updateAmmoCount();
            this.self.justFired = true; // set just fired to true to prevent spam fire
            setTimeout(() => this.self.justFired = false, this.self.getActiveWeapon().fireRate) // set just fired back to false on a delayed timer that equals the weapons firerate
            this.castRay();
          }
          else 
            break;
          
          await timer(this.self.getActiveWeapon().fireRate); // then the created Promise can be awaited
        }
        if (this.self.getActiveWeapon().ammo <= 0) this.reloadWeapon();
      }
    }

    fire(); 
  }

  reloadWeapon() {
    if (!this.self.swappingWeapons) {
      this.self.getActiveWeapon().reloadSound.play();
      this.gunSight.visibility = 0;
      this.reloadingSight.visibility = 1;
      this.self.getActiveWeapon().reloadSound.onEndedObservable.add(() => { 
        this.self.getActiveWeapon().ammo = this.self.getActiveWeapon().magazine;
        this.updateAmmoCount();
        this.gunSight.visibility = 1;
        this.reloadingSight.visibility = 0;
      });
    }
  }

  castRay() {
    
    let origin = this.camera.position; 
    let length = 50000;
    let wm = this.camera.getWorldMatrix();
    let aimVector = Vector3.TransformNormal(Vector3.Forward(), wm).normalize();
    let ray = new Ray(origin, aimVector, length);

    // log picked
    let pickingInfo = this.scene.pickWithRay(ray);
    if (pickingInfo.pickedMesh != null && (pickingInfo.pickedMesh.name.indexOf('enemy') >=  0)) {
      this.hitMarkerSound.play();
      this.hitMarkerSight.visibility = 1;
      setTimeout(() => this.hitMarkerSight.visibility = 0, 65);
      this.targetHit(pickingInfo.pickedMesh.parent.id);
    }

  }

  targetHit(id: string) {
    let enemy = this.playerService.get(id);
    enemy.health-= this.self.getActiveWeapon().damage; // maybe base this off current weapon damage instead of flat 10
    enemy.wasHitRecently = true;
    enemy.lastDamagedBy = this.self.userId;

    console.log(enemy.health)
  
    if (enemy.health <= 0) {
      this.updateKillLogs(enemy.lastDamagedBy + ' killed ' + enemy.userId);
      setTimeout(() => enemy.health = 100, 2000);

      for (let k = 0; k < enemy.playerMesh.getChildMeshes().length; k++) {
        enemy.playerMesh.getChildMeshes()[k].visibility = 0;
        enemy.playerMesh.getChildMeshes()[k].isPickable = false;

        setTimeout(() => {
          enemy.playerMesh.getChildMeshes()[k].visibility = 1;
          enemy.playerMesh.getChildMeshes()[k].isPickable = true;
        }, 2000);
      }
    }
  }

  handleHealth() {

    // this.scene.onAfterRenderObservable.add(() => { 
    //   for (let i = 0; i < this.enemies.length; i++) 
    //     if (this.enemies[i].health <= 0) {
    //       setTimeout(() => this.enemies[i].health = 100, 2000);

    //       for (let k = 0; k < this.enemies[i].playerMesh.getChildMeshes().length; k++) {
    //         this.enemies[i].playerMesh.getChildMeshes()[k].visibility = 0;
    //         this.enemies[i].playerMesh.getChildMeshes()[k].isPickable = false;

    //         setTimeout(() => {
    //           this.enemies[i].playerMesh.getChildMeshes()[k].visibility = 1;
    //           this.enemies[i].playerMesh.getChildMeshes()[k].isPickable = true;
    //         }, 2000);
    //       }
    //     }
            
    // });
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

  handleSideNavKeyBind() {
    document.addEventListener('keydown', event => { 
      if (event.code == 'Tab') {
        // document.exitPointerLock();
        // //event.preventDefault();
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
