import { Injectable, ElementRef } from '@angular/core';
import { UniversalCamera, Vector3, Scene } from '@babylonjs/core';

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
  gun: Gun;
  shoot: boolean;
  justFired: boolean = false;
  isSceneLocked: boolean = false;

  constructor(private gunService: GunService) { }

  addFpsMechanics(camera: UniversalCamera, scene: Scene, canvas: ElementRef<HTMLCanvasElement>, gun: Gun) {
    this.camera = camera;
    this.scene = scene;
    this.canvas = canvas;
    this.gun = gun;

    this.createFpsCamera();
    this.lockGunToCamera(4, -25, 20);
    this.createFpsKeyBinds();
    this.handlePointerEvents();
  }

  createFpsCamera() {
    this.camera.checkCollisions = true;
    this.camera.applyGravity = true;
    this.camera.ellipsoid = new Vector3(5,10,5);

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

    this.camera.speed = 3; // controls WASD speed
    this.camera.angularSensibility = 8000; // controls mouse speed
  }

  lockGunToCamera(xOffset: number, yOffset: number, zOffset: number) {
    this.gun.gunMesh.position = new Vector3(this.camera.position.x + xOffset, this.camera.position.y + yOffset, this.camera.position.z + zOffset);
    this.gun.gunMesh.parent = this.camera;
  }

  createFpsKeyBinds() {
    this.handleRunOnShift();
    this.handleFlyOnSpace();
    this.handleReloadOnR();
  }

  handleRunOnShift() {
    document.addEventListener('keydown', event => { if (event.code == 'ShiftLeft') this.camera.speed = 5 });
    document.addEventListener('keyup', event => { if (event.code == 'ShiftLeft') this.camera.speed = 3 });
  }

  handleFlyOnSpace() {
    document.addEventListener('keydown', event => { if (event.code == 'Space') this.camera.applyGravity = !this.camera.applyGravity });
  }

  handleReloadOnR() {
    document.addEventListener('keydown', event => { 
      if (this.isSceneLocked && event.code == 'KeyR' && this.gun.ammo < this.gun.magazine) {
        this.gun.reloadSound.play();
        this.gun.ammo = this.gun.magazine;
        console.log('RELOADING...')
        console.log('ammo: ' + this.gun.ammo)
      }
    });
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
    // Returns a Promise that resolves after "ms" Milliseconds
    const timer = ms => new Promise(res => setTimeout(res, ms));

    let fire = async () => { // We need to wrap the loop into an async function for this to work

      // cant fire if reloading or if you just fired
      if (!this.gun.reloadSound.isPlaying && !this.justFired) {
        for (var i = 0; i < currentAmmo; i++) {
          if (this.shoot && !this.gun.reloadSound.isPlaying) {
            this.gun.gunshotSound.play();
            this.gun.ammo--;
            this.justFired = true; // set just fired to true to prevent spam fire
            setTimeout(() => this.justFired = false, this.gun.fireRate) // set just fired back to false on a delayed timer that equals the weapons firerate
            console.log(this.gun.ammo)
          }
          else 
            break;
          
          await timer(this.gun.fireRate); // then the created Promise can be awaited
        }
        if (this.gun.ammo <= 0) { 
          this.gun.reloadSound.play(); 
          this.gun.ammo = this.gun.magazine;
          console.log('RELOADING...')
          console.log('ammo: ' + this.gun.ammo)
        }
      }
    }

    fire(); 
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
