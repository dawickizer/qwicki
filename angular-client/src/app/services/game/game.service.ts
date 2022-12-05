import { Injectable, ElementRef } from '@angular/core';
import { UniversalCamera, Sound, Mesh, Vector3, Scene } from '@babylonjs/core';

// Services/Models
import { PlayerService } from 'src/app/services/player/player.service';
import { Player } from 'src/app/models/player/player';

// Physics
import { KeyBindService } from '../key-bind/key-bind.service';
import { MatchMakingService } from '../match-making/match-making.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  camera: UniversalCamera;
  scene: Scene;
  canvas: ElementRef<HTMLCanvasElement>;
  self: Player;
  username: string;
  gunSightCamera: UniversalCamera;
  gunSight: Mesh;
  isSceneLocked: boolean = false;
  sprintSpeed: number = 130;
  walkSpeed: number = 80;
  crouchSpeed: number = 40;

  constructor(private matchMakingService: MatchMakingService,
              private playerService: PlayerService, 
              private keyBindService: KeyBindService) { }

  async addFpsMechanics(scene: Scene, canvas: ElementRef<HTMLCanvasElement>, username: string) {
    this.camera = scene.activeCamera as UniversalCamera;
    this.scene = scene;
    this.canvas = canvas;
    this.username = username;
    this.createFpsCamera();
    this.createFpsKeyBinds();
    this.handlePointerEvents();
    await this.createPlayer();
    this.handlePlayerPosition();
  }

  async createPlayer() {
    this.self = new Player(this.username, 'self');
    this.self.playerMeshURL = 'assets/babylonjs/models/dude/dude.babylon';
    this.self.meleeSoundURL = 'assets/babylonjs/sounds/melee/stab.mp3';
    this.self.moveSpeed = this.camera.speed;
    this.self.cameraAngularSensibility = this.camera.angularSensibility; 
    this.self.cameraInertia = this.camera.inertia; 

    await this.playerService.create(this.self, this.scene);

    this.self.createSelectingMesh(this.scene, this.camera);
    this.self.createMeleeWeapon(this.scene);

    for (let i = 0; i < this.self.playerMesh.getChildMeshes().length; i++) this.self.playerMesh.getChildMeshes()[i].layerMask = 0x10000000; // make dude and dude nodes invisible to main fps camera
    this.self.playerMesh.position = new Vector3(0, -64, -5); // offset dude back in the Z direction and down in the Y direction by the height of the camera elipsoid
    this.self.playerMesh.bakeCurrentTransformIntoVertices(); // make new default 0,0,0 position
  }

  handlePlayerPosition() {
    this.scene.beforeCameraRender = () => {
      this.self.playerMesh.position = this.camera.position;
      this.self.playerMesh.rotation = this.camera.rotation;
    };
  }

  createFpsCamera() {
    this.camera.checkCollisions = true;
    this.camera.applyGravity = true;
    this.camera.ellipsoid = new Vector3(5, 32, 5);

    this.camera.keysUp = [];
    this.camera.keysUp.push('w'.charCodeAt(0));
    this.camera.keysUp.push('W'.charCodeAt(0));

    this.camera.keysUpward.push(' '.charCodeAt(0)); // registers an input to apply gravity 
    this.camera.keysDownward.push('c'.charCodeAt(0)); // registers an input to applay crouch
    this.camera.keysDownward.push('C'.charCodeAt(0)); // registers an input to applay crouch

    this.camera.keysLeft = [];
    this.camera.keysLeft.push('a'.charCodeAt(0));
    this.camera.keysLeft.push('A'.charCodeAt(0));

    this.camera.keysDown = [];
    this.camera.keysDown.push('s'.charCodeAt(0));
    this.camera.keysDown.push('S'.charCodeAt(0));

    this.camera.keysRight = [];
    this.camera.keysRight.push('d'.charCodeAt(0));
    this.camera.keysRight.push('D'.charCodeAt(0));

    this.camera.speed = this.walkSpeed; // controls WASD speed
    this.camera.angularSensibility = 5000; // controls mouse speed
    this.camera.inertia = .2; // controls 'smoothness'

  }

  createFpsKeyBinds() {
    this.handleRunOnShift();
    this.handleCrouchOnC();
    this.handleFlyOnSpace();
  }

  handleRunOnShift() {
    this.keyBindService.setKeyBind('keydown', event => { if (this.isSceneLocked && event.code == 'ShiftLeft') this.sprint() });
    this.keyBindService.setKeyBind('keyup', event => { if (this.isSceneLocked && event.code == 'ShiftLeft') this.walk() });
  }

  // due to system settings and how they control shortcut keys...ctrl+ shortcuts cannot fully be disabled. Putting crouch on C
  handleCrouchOnC() {
    this.keyBindService.setKeyBind('keydown', event => { if (this.isSceneLocked && event.code == 'KeyC') this.crouched() });
  }
  
  sprint() {
    this.camera.speed = this.sprintSpeed;
    if (this.self.crouched) this.stand();
    this.self.sprinting = true;
  }

  stand() {
    this.camera.speed = this.walkSpeed;
    this.camera.position = this.camera.position.add(new Vector3(0, 24, 0));
    this.camera.ellipsoid = new Vector3(5, 32, 5);
    this.self.crouched = false;
  }

  crouch() {
    this.camera.speed = this.crouchSpeed;
    this.camera.position = this.camera.position.add(new Vector3(0, -10, 0));
    this.camera.ellipsoid = new Vector3(5, 20, 5);
    this.self.crouched = true;
  }

  crouched() {
    if (this.self.crouched) this.stand();
    else this.crouch();
    this.self.sprinting = false;
  }

  walk() {
    if (this.self.crouched) this.camera.speed = this.crouchSpeed;
    else this.camera.speed = this.walkSpeed
    this.self.sprinting = false;
  }

  handleFlyOnSpace() {
    this.keyBindService.setKeyBind('keydown', event => { 
      if (this.isSceneLocked && event.code == 'Space') {
        if (this.self.crouched) this.stand();
        else this.camera.applyGravity = !this.camera.applyGravity;
      }
  });
  }

  handlePointerEvents() {
   
    // Hide and lock mouse cursor when scene is clicked
    this.scene.onPointerDown = (event) => { 
      if (!this.isSceneLocked) this.canvas.nativeElement.requestPointerLock(); // lock the screen if left mouse clicked and screen not locked
      else if (this.isSceneLocked && event.button == 0) console.log('screen locked') // screen is locked...fire weapon
    };

    this.scene.onPointerUp = (event) => { if (event.button == 0) this.self.canShoot = false };

    // Toggle state of pointer lock so that requestPointerLock does not get called repetitively and handle window state
    this.handlePointerLockChange();
  }

  handlePointerLockChange() {
     // Toggle state of pointer lock so that requestPointerLock does not get called repetitively and handle window state
     this.keyBindService.setKeyBind('pointerlockchange', () => {
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





