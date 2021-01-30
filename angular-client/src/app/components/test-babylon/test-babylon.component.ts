// Core
import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { Engine, UniversalCamera, SceneLoader, Sound, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3, StandardMaterial, Texture, CubeTexture, Color3 } from '@babylonjs/core';
import "@babylonjs/core/Debug/debugLayer";
import '@babylonjs/inspector';

// Services/Models
import { GunService } from 'src/app/services/gun/gun.service';
import { Gun } from 'src/app/models/gun/gun';

@Component({
  selector: 'app-test-babylon',
  templateUrl: './test-babylon.component.html',
  styleUrls: ['./test-babylon.component.css']
})
export class TestBabylonComponent implements OnInit {

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;

  @Output() engine: Engine;
  @Output() scene: Scene;
  @Output() universalCamera: UniversalCamera;
  @Output() light: HemisphericLight;
  @Output() skybox: Mesh;
  @Output() ground: Mesh;
  @Output() platform: Mesh;
  @Output() sphere: Mesh;
  @Output() sceneIsLocked: boolean = false;
  @Output() m4: Gun;

  constructor(private gunService: GunService) { }

  async ngOnInit() {

    this.createScene();
    this.handleWindowResize(this.engine);
    this.handlePointerLock(this.scene);
    this.handleRunOnShift(this.universalCamera);
    this.handleFlyOnSpace(this.universalCamera);
    this.handleDebugLayer(this.scene);

    this.m4 = await this.gunService.get('m4', this.scene);
    this.m4.gunMesh.position = new Vector3(this.universalCamera.position.x + 4, this.universalCamera.position.y - 25 ,this.universalCamera.position.z + 20);
    this.m4.gunMesh.parent = this.universalCamera;

    this.skybox = this.createSkyBox(this.scene);
    this.ground = this.createGround(this.scene, 250, 0, 'grass.jpg');
    this.platform = this.createGround(this.scene, 500, -200, 'lava.jpg');
    this.sphere = this.createSphere(this.scene);

    this.handleReloadOnR();

    // running babylonJS
    this.render();

  }

  createScene() {
    this.engine = new Engine(this.canvas.nativeElement, true);
    this.scene = new Scene(this.engine);
    this.scene.gravity = new Vector3(0, -5, 0);
    this.scene.collisionsEnabled = true;
    this.light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
    this.createUniversalCamera();
  }

  createUniversalCamera() {
    this.universalCamera = new UniversalCamera('universalCamera', new Vector3(0, 20, 0), this.scene);
    this.universalCamera.attachControl(this.canvas.nativeElement, true);

    this.universalCamera.checkCollisions = true;
    this.universalCamera.applyGravity = true;
    this.universalCamera.ellipsoid = new Vector3(5,10,5);

    this.universalCamera.keysUp = [];
    this.universalCamera.keysUp.push('w'.charCodeAt(0));
    this.universalCamera.keysUp.push('W'.charCodeAt(0));

    this.universalCamera.keysUpward.push(' '.charCodeAt(0)); // registers an input to apply gravity 

    this.universalCamera.keysLeft = [];
    this.universalCamera.keysLeft.push('a'.charCodeAt(0));
    this.universalCamera.keysLeft.push('A'.charCodeAt(0));

    this.universalCamera.keysDown = [];
    this.universalCamera.keysDown.push('s'.charCodeAt(0));
    this.universalCamera.keysDown.push('S'.charCodeAt(0));

    this.universalCamera.keysRight = [];
    this.universalCamera.keysRight.push('d'.charCodeAt(0));
    this.universalCamera.keysRight.push('D'.charCodeAt(0));

    this.universalCamera.speed = 3; // controls WASD speed
    this.universalCamera.angularSensibility = 8000; // controls mouse speed
  }

  createSkyBox(scene: Scene): Mesh {
    
    let skybox = MeshBuilder.CreateBox('skybox', { size: 500 }, scene);
    let skyboxMaterial = new StandardMaterial('skybox', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture('assets/babylon/textures/joe/joe', scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    skybox.checkCollisions = true;
    return skybox;
  }

  createGround(scene: Scene, size: number, y_position: number, texture: string): Mesh {
    let ground = MeshBuilder.CreateGround('ground', { width: size, height: size }, scene);
    ground.position.y = y_position;
    let groundMat = new StandardMaterial('groundMat', scene);
    groundMat.backFaceCulling = false;
    groundMat.diffuseTexture = new Texture('assets/babylon/textures/' + texture, scene);
    ground.material = groundMat;
    ground.checkCollisions = true;
    return ground;
  }

  createSphere(scene: Scene): Mesh {
    let sphere = MeshBuilder.CreateSphere('sphere', { diameter: 25 }, scene);
    sphere.position.y = 15;
    sphere.position.z = 100;
    sphere.rotation.x = 0;
    sphere.rotation.y = 38.5;
    sphere.rotation.z = 91;
    sphere.checkCollisions = true;

    let sphereMat = new StandardMaterial('sphereMat', scene);
    sphereMat.diffuseTexture = new Texture('assets/babylon/textures/joe.jpg', scene);
    sphere.material = sphereMat;
    return sphere;
  }

  handleWindowResize(engine: Engine) {
    window.addEventListener('resize', () => engine.resize());   
  }

  handlePointerLock(scene: Scene) {

    let shoot: boolean;
   
    // Hide and lock mouse cursor when scene is clicked
    scene.onPointerDown = (event) => { 
      if (!this.sceneIsLocked) this.canvas.nativeElement.requestPointerLock(); // lock the screen if left mouse clicked and screen not locked
      else if (this.sceneIsLocked && event.button == 0) {

        this.m4.magazine = this.m4.ammo;
        shoot = true;
        // Returns a Promise that resolves after "ms" Milliseconds
        const timer = ms => new Promise(res => setTimeout(res, ms));

        let load = async () => { // We need to wrap the loop into an async function for this to work

          // cant fire if reloading
          if (!this.m4.reloadSound.isPlaying) {
            for (var i = 0; i < this.m4.magazine; i++) {
              if (shoot && !this.m4.reloadSound.isPlaying) {
                this.m4.gunshotSound.play();
                this.m4.ammo--;
                console.log(this.m4.ammo)
              }
              else break;
              await timer(this.m4.fireRate); // then the created Promise can be awaited
            }
            if (this.m4.ammo <= 0) { 
              this.m4.reloadSound.play(); 
              this.m4.ammo = 30;
              console.log(this.m4.ammo)
            }
          }
        }

        load();
      }
    };

    scene.onPointerUp = (event) => { if (event.button == 0) shoot = false };

    // Toggle state of pointer lock so that requestPointerLock does not get called repetitively and handle window state
    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement) {
        this.sceneIsLocked = true;
        this.unloadScrollBars();
        this.scrollWindowToBottom();
      }
      else {
        this.sceneIsLocked = false;
        this.reloadScrollBars();
        this.scrollWindowToTop();
      }
    });
  }

  handleReloadOnR() {
    document.addEventListener('keydown', event => { 
      if (event.code == 'KeyR' && this.m4.ammo < 30) {
      this.m4.reloadSound.play();
      this.m4.ammo = 30;
      console.log(this.m4.ammo)
      }
    });
  }

  handleRunOnShift(universalCamera: UniversalCamera) {
    document.addEventListener('keydown', event => { if (event.code == 'ShiftLeft') universalCamera.speed = 5 });
    document.addEventListener('keyup', event => { if (event.code == 'ShiftLeft') universalCamera.speed = 3 });
  }

  handleFlyOnSpace(universalCamera: UniversalCamera) {
    document.addEventListener('keydown', event => { if (event.code == 'Space') universalCamera.applyGravity = !universalCamera.applyGravity });
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

  handleDebugLayer(scene: Scene) {
    document.addEventListener('keydown', event => { 
      if (event.code == 'NumpadAdd') {
        if (scene.debugLayer.isVisible()) scene.debugLayer.hide();
        else scene.debugLayer.show();
      }
    });
  }

  render() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}
