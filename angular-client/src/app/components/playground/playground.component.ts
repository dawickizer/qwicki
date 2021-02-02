import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { Engine, ArcRotateCamera, FreeCamera, HemisphericLight, Sprite, Mesh, MeshBuilder, InstancedMesh, Scene, Vector3, SceneLoader, Sound, StandardMaterial, Texture, Color3, CubeTexture } from '@babylonjs/core';
import "@babylonjs/core/Debug/debugLayer";
import '@babylonjs/inspector';
// import * as BABYLON from '@babylonjs/core';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;

  @Output() engine: Engine;
  @Output() scene: Scene;
  @Output() camera: ArcRotateCamera;
  @Output() freeCam: FreeCamera;
  @Output() light: HemisphericLight;
  @Output() music: Sound;
  @Output() ground: Mesh;
  @Output() landscape: Mesh;
  @Output() skyBox: Mesh;
  @Output() moon: Mesh;
  @Output() house: Mesh;
  @Output() trees: Sprite[];
  @Output() houses: InstancedMesh[];

  constructor() { }

  async ngOnInit() {

    // Basic starter code to get a scene set up
    this.createScene();

    // Create scene elements
    this.ground = this.createGround(this.scene);
    this.landscape = this.createLandScape(this.scene);
    this.skyBox = this.createSkyBox(this.scene);
    this.moon = this.createMoon(this.scene);
    this.house = await this.importHouse(this.scene);
    this.houses  = this.cloneHouse(this.house, 4);
    this.music = this.createMusic(this.scene);

    // running babylonJS
    this.render();
    this.scene.debugLayer.show();

  }

  createScene() {
    this.engine = new Engine(this.canvas.nativeElement, true);
    this.scene = new Scene(this.engine);
    this.camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.2, 30, new Vector3(0, 4, 0), this.scene);
    this.camera.attachControl(this.canvas.nativeElement, true);
    this.camera.upperBetaLimit = Math.PI / 2.2;
    this.camera.radius = 30;

    // this.freeCam = new FreeCamera('freeCam', new Vector3(0, 4, 0), this.scene);
    // this.freeCam.attachControl(this.canvas.nativeElement, true);

    this.scene.registerBeforeRender(() => { 
      if (this.camera.radius > 70) this.camera.radius = 70;
      if (this.camera.radius < 30) this.camera.radius = 30; 
    });
    this.light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
  }

  createSkyBox(scene: Scene): Mesh {
    let skyBox = MeshBuilder.CreateBox('skyBox', { size: 150 }, scene);
    let skyboxMaterial = new StandardMaterial('skyBox', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture('assets/playground/textures/night-sky/night-sky', scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skyBox.material = skyboxMaterial;
    return skyBox;
  }

  createGround(scene: Scene): Mesh {
    let ground = MeshBuilder.CreateGround('ground', { width: 50, height: 100 }, scene);
    const groundMat = new StandardMaterial('groundMat', scene);
    groundMat.diffuseTexture = new Texture('assets/playground/textures/grass.jpg', scene);
    ground.material = groundMat;
    return ground;
  }

  createLandScape(scene: Scene): Mesh {
    let landscape = MeshBuilder.CreateGroundFromHeightMap('landscape', 'assets/playground/textures/height-map.png', 
    { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 });
    let landscapeMat = new StandardMaterial('landscapeMat', scene);
    landscapeMat.diffuseTexture = new Texture('assets/playground/textures/mountain.jpg', scene);
    landscape.material = landscapeMat;
    landscape.position.y = -2;

    return this.landscape;
  }

  createMoon(scene: Scene): Mesh {
    let moon = MeshBuilder.CreateSphere('moon', {segments: 100, diameter: 7}, scene);
    moon.position.x = -40;
    moon.position.y = 23;
    moon.position.z = 50;
    const moonMat = new StandardMaterial('moonMat', scene);
    moonMat.diffuseTexture = new Texture('assets/playground/textures/moon.jpg', scene);
    moon.material = moonMat;
    return moon;
  }

  async importHouse(scene: Scene): Promise<Mesh> {
    let result = await SceneLoader.ImportMeshAsync('', 'assets/playground/models/', 'test-export.babylon', scene);
    result.meshes[0].position.x = -4;
    result.meshes[0].position.y = 0;
    result.meshes[0].rotation.y = 14;
    return result.meshes[0] as Mesh;
  }

  cloneHouse(house: Mesh, numHouses: number): InstancedMesh[] {
    let houses: InstancedMesh[] = [];
    for (let i = 0; i < numHouses; i++) houses[i] = house.createInstance('clonedHouse' + i);
    return this.setHousesPositions(houses);
  }

  setHousesPositions(houses: InstancedMesh[]): InstancedMesh[] {
    houses[0].position.x = -12;
    houses[0].position.z = 2;
    houses[0].rotation.y = 6;

    houses[1].position.x = -15;
    houses[1].position.z = 0;
    houses[1].rotation.y = 30.5;

    houses[2].position.x = -16;
    houses[2].position.z = -3;
    houses[2].rotation.y = 30;

    houses[3].position.x = -7;
    houses[3].position.z = 2;
    houses[3].rotation.y = 6.25;

    return houses;
  }

  createMusic(scene: Scene): Sound {
    let music = new Sound('', 'assets/playground/sounds/relaxing.mp3', scene, null, { loop: true, autoplay: true });
    music.setVolume(.1);
    return music;
  }

  render() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  ngOnDestroy(): void {
    this.music.dispose();
  }

}
