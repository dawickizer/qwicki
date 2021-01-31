// // Core
// import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
// import { Engine, UniversalCamera, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3, StandardMaterial, Texture, CubeTexture, Color3 } from '@babylonjs/core';
// import "@babylonjs/core/Debug/debugLayer";
// import '@babylonjs/inspector';

// // Services/Models
// import { GunService } from 'src/app/services/gun/gun.service';
// import { Gun } from 'src/app/models/gun/gun';

// import { FpsService } from 'src/app/services/fps/fps.service';

// @Component({
//   selector: 'app-test-babylon',
//   templateUrl: './test-babylon.component.html',
//   styleUrls: ['./test-babylon.component.css']
// })
// export class TestBabylonComponent implements OnInit {

//   @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;

//   @Output() engine: Engine;
//   @Output() scene: Scene;
//   @Output() universalCamera: UniversalCamera;
//   @Output() light: HemisphericLight;
//   @Output() skybox: Mesh;
//   @Output() ground: Mesh;
//   @Output() platform: Mesh;
//   @Output() sphere: Mesh;
//   @Output() gun: Gun;

//   constructor(private gunService: GunService, private fpsService: FpsService) { }

//   async ngOnInit() {

//     this.createScene();
//     this.handleWindowResize(this.engine);
//     this.handleDebugLayer(this.scene);

//     this.gun = await this.gunService.get('m4', this.scene);
//     this.fpsService.addFpsMechanics(this.universalCamera, this.scene, this.canvas, this.gun);

//     this.skybox = this.createSkyBox(this.scene);
//     this.ground = this.createGround(this.scene, 250, 0, 'grass.jpg');
//     this.platform = this.createGround(this.scene, 500, -200, 'lava.jpg');
//     this.sphere = this.createSphere(this.scene);

//     // running babylonJS
//     this.render();

//   }

//   createScene() {
//     this.engine = new Engine(this.canvas.nativeElement, true);
//     this.scene = new Scene(this.engine);
//     this.scene.gravity = new Vector3(0, -5, 0);
//     this.scene.collisionsEnabled = true;
//     this.light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
//     this.universalCamera = new UniversalCamera('universalCamera', new Vector3(0, 20, 0), this.scene);
//     this.universalCamera.attachControl(this.canvas.nativeElement, true);
//   }

//   createSkyBox(scene: Scene): Mesh {
//     let skybox = MeshBuilder.CreateBox('skybox', { size: 500 }, scene);
//     let skyboxMaterial = new StandardMaterial('skybox', scene);
//     skyboxMaterial.backFaceCulling = false;
//     skyboxMaterial.reflectionTexture = new CubeTexture('assets/babylon/textures/joe/joe', scene);
//     skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
//     skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
//     skyboxMaterial.specularColor = new Color3(0, 0, 0);
//     skybox.material = skyboxMaterial;
//     skybox.checkCollisions = true;
//     return skybox;
//   }

//   createGround(scene: Scene, size: number, y_position: number, texture: string): Mesh {
//     let ground = MeshBuilder.CreateGround('ground', { width: size, height: size }, scene);
//     ground.position.y = y_position;
//     let groundMat = new StandardMaterial('groundMat', scene);
//     groundMat.backFaceCulling = false;
//     groundMat.diffuseTexture = new Texture('assets/babylon/textures/' + texture, scene);
//     ground.material = groundMat;
//     ground.checkCollisions = true;
//     return ground;
//   }

//   createSphere(scene: Scene): Mesh {
//     let sphere = MeshBuilder.CreateSphere('sphere', { diameter: 25 }, scene);
//     sphere.position.y = 15;
//     sphere.position.z = 100;
//     sphere.rotation.x = 0;
//     sphere.rotation.y = 38.5;
//     sphere.rotation.z = 91;
//     sphere.checkCollisions = true;

//     let sphereMat = new StandardMaterial('sphereMat', scene);
//     sphereMat.diffuseTexture = new Texture('assets/babylon/textures/joe.jpg', scene);
//     sphere.material = sphereMat;
//     return sphere;
//   }

//   handleWindowResize(engine: Engine) {
//     window.addEventListener('resize', () => engine.resize());   
//   }

//   handleDebugLayer(scene: Scene) {
//     document.addEventListener('keydown', event => { 
//       if (event.code == 'NumpadAdd') {
//         if (scene.debugLayer.isVisible()) scene.debugLayer.hide();
//         else scene.debugLayer.show();
//       }
//     });
//   }

//   render() {
//     this.engine.runRenderLoop(() => {
//       this.scene.render();
//     });
//   }
// }


// Core
import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { Engine, UniversalCamera, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3, StandardMaterial, Texture, CubeTexture, Color3 } from '@babylonjs/core';
import "@babylonjs/core/Debug/debugLayer";
import '@babylonjs/inspector';

// Services/Models
import { GunService } from 'src/app/services/gun/gun.service';
import { Gun } from 'src/app/models/gun/gun';
import { FpsService } from 'src/app/services/fps/fps.service';

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
  @Output() isSceneLocked: boolean = false;
  @Output() shoot: boolean;
  @Output() gun: Gun;

  constructor(private gunService: GunService, private fpsService: FpsService) { }

  async ngOnInit() {

    this.createScene();
    this.handleWindowResize(this.engine);
    this.handlePointerLock(this.scene);
    this.handleDebugLayer(this.scene);

    this.gun = await this.gunService.get('m4', this.scene);
    this.fpsService.addFpsMechanics(this.universalCamera, this.scene, this.canvas, this.gun);

    this.skybox = this.createSkyBox(this.scene);
    this.ground = this.createGround(this.scene, 250, 0, 'grass.jpg');
    this.platform = this.createGround(this.scene, 500, -200, 'lava.jpg');
    this.sphere = this.createSphere(this.scene);

    // running babylonJS
    this.render();

  }

  createScene() {
    this.engine = new Engine(this.canvas.nativeElement, true);
    this.scene = new Scene(this.engine);
    this.scene.gravity = new Vector3(0, -5, 0);
    this.scene.collisionsEnabled = true;
    this.light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
    this.universalCamera = new UniversalCamera('universalCamera', new Vector3(0, 20, 0), this.scene);
    this.universalCamera.attachControl(this.canvas.nativeElement, true);
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

  handlePointerLock(scene: Scene) {
   
    // Hide and lock mouse cursor when scene is clicked
    scene.onPointerDown = (event) => { 
      if (!this.isSceneLocked) this.canvas.nativeElement.requestPointerLock(); // lock the screen if left mouse clicked and screen not locked
      else if (this.isSceneLocked && event.button == 0) {

        this.gun.magazine = this.gun.ammo;
        this.shoot = true;
        // Returns a Promise that resolves after "ms" Milliseconds
        const timer = ms => new Promise(res => setTimeout(res, ms));

        let load = async () => { // We need to wrap the loop into an async function for this to work

          // cant fire if reloading
          if (!this.gun.reloadSound.isPlaying) {
            for (var i = 0; i < this.gun.magazine; i++) {
              if (this.shoot && !this.gun.reloadSound.isPlaying) {
                this.gun.gunshotSound.play();
                this.gun.ammo--;
                console.log(this.gun.ammo)
              }
              else break;
              await timer(this.gun.fireRate); // then the created Promise can be awaited
            }
            if (this.gun.ammo <= 0) { 
              this.gun.reloadSound.play(); 
              this.gun.ammo = 30;
              console.log(this.gun.ammo)
            }
          }
        }

        load();
      }
    };

    scene.onPointerUp = (event) => { if (event.button == 0) this.shoot = false };

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

  handleWindowResize(engine: Engine) {
    window.addEventListener('resize', () => engine.resize());   
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
