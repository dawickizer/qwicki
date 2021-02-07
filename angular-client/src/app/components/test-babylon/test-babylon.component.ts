// Core
import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { IInspectorOptions, DebugLayerTab, Engine, UniversalCamera, SceneLoader, Viewport, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3, StandardMaterial, Texture, CubeTexture, Color3 } from '@babylonjs/core';
import "@babylonjs/core/Debug/debugLayer";
import '@babylonjs/inspector';

// Services/Models
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
  @Output() debugCamera: UniversalCamera;
  @Output() debugCameraIsActive: boolean = false;
  @Output() light: HemisphericLight;
  @Output() skybox: Mesh;
  @Output() ground: Mesh;
  @Output() platform: Mesh;

  constructor(private fpsService: FpsService) { }

  async ngOnInit() {

    this.createScene();
    this.handleWindowResize();
    this.handleBoundingBoxes();

    await this.fpsService.addFpsMechanics(this.scene, this.canvas);
    
    this.skybox = this.createSkyBox();
    this.ground = this.createGround(4000, 0, 'grass.jpg');
    this.platform = this.createGround(5000, -200, 'lava.jpg');

    this.handleDebugLayer();
    this.handleDebugCamera();

    // running babylonJS
    this.render();

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
    this.debugCamera = new UniversalCamera('debugCamera', new Vector3(0, 5, 0), this.scene);
  }

  createSkyBox(): Mesh {
    
    let skybox = MeshBuilder.CreateBox('skybox', { size: 5000 }, this.scene);
    let skyboxMaterial = new StandardMaterial('skybox', this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture('assets/babylon/textures/joe/joe', this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    skybox.checkCollisions = true;
    return skybox;
  }

  createGround(size: number, y_position: number, texture: string): Mesh {
    let ground = MeshBuilder.CreateGround('ground', { width: size, height: size }, this.scene);
    ground.position.y = y_position;
    let groundMat = new StandardMaterial('groundMat', this.scene);
    groundMat.backFaceCulling = false;
    groundMat.diffuseTexture = new Texture('assets/babylon/textures/' + texture, this.scene);
    ground.material = groundMat;
    ground.checkCollisions = true;
    return ground;
  }

  handleWindowResize() {
    window.addEventListener('resize', () => this.engine.resize());   
  }

  handleDebugLayer() {
    let config: IInspectorOptions = {initialTab: DebugLayerTab.Statistics, embedMode: true}
    //this.scene.debugLayer.show(config)
    document.addEventListener('keydown', event => { 
      if (event.code == 'NumpadAdd') {
        if (this.scene.debugLayer.isVisible()) this.scene.debugLayer.hide();
        else this.scene.debugLayer.show(config);
      }
    });
  }

  handleDebugCamera() {

    document.addEventListener('keydown', event => { 
      if (event.code == 'NumpadSubtract' ) {
        this.debugCameraIsActive = !this.debugCameraIsActive;
        if (this.debugCameraIsActive) {

          this.debugCamera.layerMask = 0x10000001; // makes dude visible to debug camera and everything else renders for debug assuming its 0x0FFFFFFF

          // Attach camera to canvas
          this.debugCamera.attachControl(this.canvas.nativeElement, true);
          
          // Push the debug camera to the list of active cameras for the scene
          this.scene.activeCameras.push(this.debugCamera);

          // Adjust the viewports
          this.scene.activeCameras[0].viewport = new Viewport(0.5, 0, 0.5, 1.0); // FPS Camera
          this.scene.activeCameras[1].viewport = this.scene.activeCameras[0].viewport // Gunsight Camera
          this.scene.activeCameras[2].viewport = this.debugCamera.viewport = new Viewport(0, 0, 0.5, 1.0); // Debug Camera
        } else {

          // Revert back to normal camera state
          this.scene.activeCameras[0].viewport = new Viewport(0, 0, 1, 1); // FPS Camera
          this.scene.activeCameras[1].viewport = this.scene.activeCameras[0].viewport // Gunsight Camera

          // Revert back to normal active cameras
          this.debugCamera.detachControl();
          this.scene.activeCameras.pop();
        }
      }
    });
  }

  handleBoundingBoxes() {
    document.addEventListener('keydown', event => { if (event.code == 'NumpadEnter') for (let i = 0; i < this.scene.meshes.length; i++) this.scene.meshes[i].showBoundingBox = !this.scene.meshes[i].showBoundingBox });
  }

  render() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}
