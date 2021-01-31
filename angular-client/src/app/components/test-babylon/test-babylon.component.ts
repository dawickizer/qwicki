// Core
import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { Engine, UniversalCamera, SceneLoader, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3, StandardMaterial, Texture, CubeTexture, Color3 } from '@babylonjs/core';
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
  @Output() guns: Gun[];

  constructor(private gunService: GunService, private fpsService: FpsService) { }

  async ngOnInit() {

    this.createScene();
    this.handleWindowResize(this.engine);
    this.handleDebugLayer(this.scene);



      let meshes = (await SceneLoader.ImportMeshAsync('', 'assets/babylon/models/m4/scene.gltf', '', this.scene)).meshes as Mesh[];
  
      // set some default scaling/rotation so the gun size/orientation is nice
      meshes[0].position = new Vector3(30, 30, 50);
      meshes[0].rotation = new Vector3(1.5, 0, 0);
      meshes[0].scaling = new Vector3(.25, .25, -.25); 

      let meshes2 = (await SceneLoader.ImportMeshAsync('', 'assets/babylon/models/m4/scene.gltf', '', this.scene)).meshes as Mesh[];
  
      // set some default scaling/rotation so the gun size/orientation is nice
      meshes2[0].position = new Vector3(0, 30, 50);
      meshes2[0].rotation = new Vector3(1.5, 0, 0);
      meshes2[0].scaling = new Vector3(.25, .25, -.25); 

    this.gun = await this.gunService.get('m4', this.scene);
    //this.guns = await this.gunService.getAll(this.scene);
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
    this.scene.activeCamera = this.universalCamera;
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

  handleDebugLayer(scene: Scene) {
    this.scene.debugLayer.show();
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
