import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { Engine, UniversalCamera, SceneLoader, HemisphericLight, Sound, Mesh, MeshBuilder, Scene, Vector3, StandardMaterial, Texture, CubeTexture, Color3 } from '@babylonjs/core';
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
  @Output() universalCamera: UniversalCamera;
  @Output() light: HemisphericLight;
  @Output() skybox: Mesh;
  @Output() ground: Mesh;
  @Output() platform: Mesh;
  @Output() sphere: Mesh;
  @Output() gun: Mesh;
  @Output() music: Sound;
  @Output() sceneIsLocked: boolean = false;

  constructor() { }

  ngOnInit() {

    this.createScene();
    this.handleWindowResize(this.engine);
    this.handlePointerLock(this.scene);
    this.handleRunOnShift(this.universalCamera);
    this.handleFlyOnSpace(this.universalCamera);
    this.handleDebugLayer(this.scene);

    this.skybox = this.createSkyBox(this.scene);
    this.ground = this.createGround(this.scene, 250, 0, 'grass.jpg');
    this.platform = this.createGround(this.scene, 500, -200, 'lava.jpg');
    this.sphere = this.createSphere(this.scene);
    this.gun = this.importGun(this.scene);
    this.music = this.createMusic(this.scene);

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

    this.universalCamera.speed = 2; // controls WASD speed
    this.universalCamera.angularSensibility = 7000; // controls mouse speed
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

  importGun(scene: Scene): Mesh {
    let gun: Mesh;
    SceneLoader.ImportMesh('', 'assets/babylon/models/m4/', 'scene.gltf', this.scene, (meshes) => {
      gun = meshes[0] as Mesh;
      gun.position = new Vector3(0, 15, 0);
      gun.scaling = new Vector3(.25, .25, .25);
    });
    return gun;
  }

  handleWindowResize(engine: Engine) {
    window.addEventListener('resize', () => engine.resize());   
  }

  handlePointerLock(scene: Scene) {
    // Hide and lock mouse cursor when scene is clicked
    scene.onPointerDown = () => { if (!this.sceneIsLocked) this.canvas.nativeElement.requestPointerLock() }

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

  handleRunOnShift(universalCamera: UniversalCamera) {
    document.addEventListener('keydown', event => { if (event.code == 'ShiftLeft') universalCamera.speed = 4 });
    document.addEventListener('keyup', event => { if (event.code == 'ShiftLeft') universalCamera.speed = 2 });
  }

  handleFlyOnSpace(universalCamera: UniversalCamera) {
    document.addEventListener('keydown', event => { if (event.code == 'Space') universalCamera.applyGravity = !universalCamera.applyGravity });
  }

  handleJumpOnSpace(universalCamera: UniversalCamera) {
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

  createMusic(scene: Scene): Sound {
    let music = new Sound('', 'assets/babylon/sounds/relaxing.mp3', scene, null, { loop: true, autoplay: true });
    music.setVolume(.1);
    return music;
  }

  ngOnDestroy(): void {
    this.music.dispose();
  }

  render() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}
