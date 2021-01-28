import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { Engine, ArcRotateCamera, FreeCamera, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3, StandardMaterial, Texture, CubeTexture, Color3 } from '@babylonjs/core';
import "@babylonjs/core/Debug/debugLayer";
import '@babylonjs/inspector';

@Component({
  selector: 'app-test-babylon',
  templateUrl: './test-babylon.component.html',
  styleUrls: ['./test-babylon.component.css']
})
export class TestBabylonComponent implements OnInit {

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;

  @Output() engine: Engine;
  @Output() scene: Scene;
  @Output() arcCamera: ArcRotateCamera;
  @Output() freeCamera: FreeCamera;
  @Output() light: HemisphericLight;
  @Output() skybox: Mesh;
  @Output() ground: Mesh;
  @Output() sphere: Mesh;
  @Output() sceneIsLocked: boolean = false;

  constructor() { }

  ngOnInit() {

    this.createScene();

    this.skybox = this.createSkyBox(this.scene);
    this.ground = this.createGround(this.scene);
    this.sphere = this.createSphere(this.scene);

    // handle window resize events
    window.addEventListener('resize', () => this.engine.resize());

    // handle cursor setup
    this.handleCursor(this.scene);

    // temp solution to lock camera at fixed height
    this.scene.registerBeforeRender(() => { 

      if (this.freeCamera._position.y != 10) this.freeCamera._position.y = 13; 

      this.sphere.rotation.y += Math.PI / 100;
      
    
    });

    // debug tools
    //this.scene.debugLayer.show();

    // running babylonJS
    this.render();

  }

  createScene() {
    this.engine = new Engine(this.canvas.nativeElement, true);
    this.scene = new Scene(this.engine);
    this.light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
    //this.createArcCamera();
    this.createFreeCamera();
  }

  createArcCamera() {
    this.arcCamera = new ArcRotateCamera('arcCamera', -Math.PI / 2, Math.PI / 2.2, 30, new Vector3(0, 4, 0), this.scene);
    this.arcCamera.attachControl(this.canvas.nativeElement, true);
    this.arcCamera.upperBetaLimit = Math.PI / 2.2;
    this.arcCamera.radius = 30;
    this.scene.registerBeforeRender(() => { 
      if (this.arcCamera.radius > 70) this.arcCamera.radius = 70;
      if (this.arcCamera.radius < 30) this.arcCamera.radius = 30; 
    });
  }

  createFreeCamera() {
    this.freeCamera = new FreeCamera('freeCamera', new Vector3(0, 13, 0), this.scene);
    this.freeCamera.attachControl(this.canvas.nativeElement, true);
    this.freeCamera.checkCollisions = true;
    this.freeCamera.applyGravity = true;

    this.freeCamera.keysUp = [];
    this.freeCamera.keysUp.push('w'.charCodeAt(0));
    this.freeCamera.keysUp.push('W'.charCodeAt(0));

    this.freeCamera.keysLeft = [];
    this.freeCamera.keysLeft.push('a'.charCodeAt(0));
    this.freeCamera.keysLeft.push('A'.charCodeAt(0));

    this.freeCamera.keysDown = [];
    this.freeCamera.keysDown.push('s'.charCodeAt(0));
    this.freeCamera.keysDown.push('S'.charCodeAt(0));

    this.freeCamera.keysRight = [];
    this.freeCamera.keysRight.push('d'.charCodeAt(0));
    this.freeCamera.keysRight.push('D'.charCodeAt(0));

    this.freeCamera.speed = 2; // controlls WASD
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

  createGround(scene: Scene): Mesh {
    let ground = MeshBuilder.CreateGround('ground', { width: 500, height: 500 }, scene);
    let groundMat = new StandardMaterial('groundMat', scene);
    groundMat.diffuseTexture = new Texture('assets/babylon/textures/grass.jpg', scene);
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

  handleCursor(scene: Scene) {
    // Hide and lock mouse cursor when scene is clicked
    scene.onPointerDown = () => { if (!this.sceneIsLocked) this.canvas.nativeElement.requestPointerLock(); }

    // Toggle state of pointer lock so that requestPointerLock does not get called repetitively
    document.addEventListener('pointerlockchange', () => {
      let element = document.pointerLockElement || null;
      if (element) this.sceneIsLocked = true;
      else this.sceneIsLocked = false;
    });
  }

  render() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  ngOnDestroy() {

  }
}
