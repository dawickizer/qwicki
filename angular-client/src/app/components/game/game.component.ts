// Core
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Engine, UniversalCamera, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3, StandardMaterial, Texture, CubeTexture, Color3 } from '@babylonjs/core';
import "@babylonjs/core/Debug/debugLayer";
import '@babylonjs/inspector';

// Services/Models
import { AuthService } from 'src/app/services/auth/auth.service';
import { GameService } from 'src/app/services/game/game.service';
import { KeyBindService } from 'src/app/services/key-bind/key-bind.service';

import { Player } from 'src/app/models/player/player';
import { PlayerService } from 'src/app/services/player/player.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('drawer') drawer: MatSidenav;

  engine: Engine;
  scene: Scene;
  universalCamera: UniversalCamera;
  light: HemisphericLight;
  skybox: Mesh;
  ground: Mesh;
  username: string = '';
  self: Player;
  gunSightCamera: UniversalCamera;
  gunSight: Mesh;
  isSceneLocked: boolean = false;
  sprintSpeed: number = 130;
  walkSpeed: number = 80;
  crouchSpeed: number = 40;

  constructor(private gameService: GameService, private playerService: PlayerService, private authService: AuthService, private keyBindService: KeyBindService) { }

  async ngOnInit() {}

  // wait for Angular to initialize components before rendering the scene else pixelated rendering happens
  async ngAfterViewInit() {

    this.authService.currentUser().subscribe({
      next: async user => {
        this.username = user.username;
        this.createScene();
        this.handleWindowResize();
        await this.addFpsMechanics()
        this.skybox = this.createSkyBox();
        this.ground = this.createGround(4000, 0, 'grass.jpg');
        this.render();
      }, 
      error: error => this.authService.logout()
    });
  }

  ngOnDestroy() {
    console.log('Disposing scene')
    this.scene?.dispose();
    this.keyBindService.removeKeyBinds();
  }

  createScene() {
    this.engine = new Engine(this.canvas.nativeElement, true);
    this.scene = new Scene(this.engine);
    this.scene.gravity = new Vector3(0, -5, 0);
    this.scene.collisionsEnabled = true;
    this.light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
    this.universalCamera = new UniversalCamera('universalCamera', new Vector3(0, 64, 0), this.scene);
    this.universalCamera.attachControl(this.canvas.nativeElement, true);
    this.scene.activeCamera = this.universalCamera;
  }

  createSkyBox(): Mesh {
    let skybox = MeshBuilder.CreateBox('skybox', { size: 5000 }, this.scene);
    let skyboxMaterial = new StandardMaterial('skybox', this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture('assets/babylonjs/textures/night-sky/night-sky', this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    return skybox;
  }

  createGround(size: number, y_position: number, texture: string): Mesh {
    let ground = MeshBuilder.CreateGround('ground', { width: size, height: size }, this.scene);
    ground.position.y = y_position;
    let groundMat = new StandardMaterial('groundMat', this.scene);
    groundMat.backFaceCulling = false;
    groundMat.diffuseTexture = new Texture('assets/babylonjs/textures/' + texture, this.scene);
    ground.material = groundMat;
    ground.checkCollisions = true;
    return ground;
  }

  async addFpsMechanics() {
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
    this.self.moveSpeed = this.universalCamera.speed;
    this.self.cameraAngularSensibility = this.universalCamera.angularSensibility; 
    this.self.cameraInertia = this.universalCamera.inertia; 

    await this.playerService.create(this.self, this.scene);

    this.self.createSelectingMesh(this.scene, this.universalCamera);
    this.self.createMeleeWeapon(this.scene);
    
    this.self.playerMesh.position = new Vector3(0, -64, -5); // offset dude back in the Z direction and down in the Y direction by the height of the camera elipsoid
    this.self.playerMesh.bakeCurrentTransformIntoVertices(); // make new default 0,0,0 position
  }

  handlePlayerPosition() {
    this.scene.beforeCameraRender = () => {
      this.self.playerMesh.position = this.universalCamera.position;
      this.self.playerMesh.rotation = this.universalCamera.rotation;
    };
  }

  createFpsCamera() {
    this.universalCamera.checkCollisions = true;
    this.universalCamera.applyGravity = true;
    this.universalCamera.ellipsoid = new Vector3(5, 32, 5);

    this.universalCamera.keysUp = [];
    this.universalCamera.keysUp.push('w'.charCodeAt(0));
    this.universalCamera.keysUp.push('W'.charCodeAt(0));

    this.universalCamera.keysUpward.push(' '.charCodeAt(0)); // registers an input to apply gravity 
    this.universalCamera.keysDownward.push('c'.charCodeAt(0)); // registers an input to applay crouch
    this.universalCamera.keysDownward.push('C'.charCodeAt(0)); // registers an input to applay crouch

    this.universalCamera.keysLeft = [];
    this.universalCamera.keysLeft.push('a'.charCodeAt(0));
    this.universalCamera.keysLeft.push('A'.charCodeAt(0));

    this.universalCamera.keysDown = [];
    this.universalCamera.keysDown.push('s'.charCodeAt(0));
    this.universalCamera.keysDown.push('S'.charCodeAt(0));

    this.universalCamera.keysRight = [];
    this.universalCamera.keysRight.push('d'.charCodeAt(0));
    this.universalCamera.keysRight.push('D'.charCodeAt(0));

    this.universalCamera.speed = this.walkSpeed; // controls WASD speed
    this.universalCamera.angularSensibility = 5000; // controls mouse speed
    this.universalCamera.inertia = .2; // controls 'smoothness'

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
    this.universalCamera.speed = this.sprintSpeed;
    if (this.self.crouched) this.stand();
    this.self.sprinting = true;
  }

  stand() {
    this.universalCamera.speed = this.walkSpeed;
    this.universalCamera.position = this.universalCamera.position.add(new Vector3(0, 24, 0));
    this.universalCamera.ellipsoid = new Vector3(5, 32, 5);
    this.self.crouched = false;
  }

  crouch() {
    this.universalCamera.speed = this.crouchSpeed;
    this.universalCamera.position = this.universalCamera.position.add(new Vector3(0, -10, 0));
    this.universalCamera.ellipsoid = new Vector3(5, 20, 5);
    this.self.crouched = true;
  }

  crouched() {
    if (this.self.crouched) this.stand();
    else this.crouch();
    this.self.sprinting = false;
  }

  walk() {
    if (this.self.crouched) this.universalCamera.speed = this.crouchSpeed;
    else this.universalCamera.speed = this.walkSpeed
    this.self.sprinting = false;
  }

  handleFlyOnSpace() {
    this.keyBindService.setKeyBind('keydown', event => { 
      if (this.isSceneLocked && event.code == 'Space') {
        if (this.self.crouched) this.stand();
        else this.universalCamera.applyGravity = !this.universalCamera.applyGravity;
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

  handleWindowResize() {
    window.addEventListener('resize', () => this.engine.resize());   
  }

  render() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}
