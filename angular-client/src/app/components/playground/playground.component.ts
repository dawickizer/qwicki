import { Component, ElementRef, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { Engine, ArcRotateCamera, HemisphericLight, Mesh, MeshBuilder, AbstractMesh, InstancedMesh, Scene, Vector3, SceneLoader, Sound, StandardMaterial, Texture, Color3, CubeTexture } from '@babylonjs/core';
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
  @Output() light: HemisphericLight;
  @Output() music: Sound;
  @Output() ground: Mesh;
  @Output() skyBox: Mesh;
  @Output() moon: Mesh;
  @Output() house: Mesh;
  @Output() houses: InstancedMesh[];

  constructor() { }

  async ngOnInit() {

    // Basic starter code to get a scene set up
    this.createScene();

    // Create scene elements
    this.ground = this.createGround(this.scene);
    this.skyBox = this.createSkyBox(this.scene);
    this.moon = this.createMoon(this.scene);
    this.house = await this.importHouse(this.scene);
    this.houses  = this.cloneHouse(this.house, 12);
    this.music = this.createMusic(this.scene);

    // running babylonJS
    this.render();

  }

  createScene() {
    this.engine = new Engine(this.canvas.nativeElement, true);
    this.scene = new Scene(this.engine);
    this.camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.2, 30, new Vector3(0, 4, 0), this.scene);
    this.camera.attachControl(this.canvas.nativeElement, true);
    this.camera.upperBetaLimit = Math.PI / 2.2;
    this.camera.radius = 30;
    this.scene.registerBeforeRender(() => { 
      if (this.camera.radius > 70) this.camera.radius = 70;
      if (this.camera.radius < 30) this.camera.radius = 30; 
    });
    this.light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
  }

  createSkyBox(scene: Scene): Mesh {
    let skyBox = MeshBuilder.CreateBox("skyBox", { size: 150 }, scene);
    let skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture("assets/playground/textures/night-sky/night-sky", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skyBox.material = skyboxMaterial;
    return skyBox;
  }

  createGround(scene: Scene): Mesh {
    let ground = MeshBuilder.CreateGround('ground', { width: 150, height: 150 }, scene);
    const groundMat = new StandardMaterial("groundMat", this.scene);
    groundMat.diffuseTexture = new Texture("assets/playground/textures/grass.jpg", scene);
    ground.material = groundMat;
    return ground;
  }

  createMoon(scene: Scene): Mesh {
    let moon = MeshBuilder.CreateSphere('moon', {segments: 100, diameter: 5}, scene);
    moon.position.x = 5;
    moon.position.y = 9;
    moon.position.z = 10;
    const moonMat = new StandardMaterial("moonMat", scene);
    moonMat.diffuseTexture = new Texture("assets/playground/textures/moon.jpg", scene);
    moon.material = moonMat;
    return moon;
  }

  async importHouse(scene: Scene): Promise<Mesh> {
    let result = await SceneLoader.ImportMeshAsync('', 'assets/playground/models/', 'house.babylon', scene);
    result.meshes[0].position.x = 0;
    result.meshes[0].position.y = 0;
    return result.meshes[0] as Mesh;
  }

  cloneHouse(house: Mesh, numClones: number): InstancedMesh[] {
    let clones: InstancedMesh[] = [];
    let offsetPositive = 3;
    let offsetNegative = -3
    for (let i = 0; i < numClones; i++) {
      clones[i] = house.createInstance('clonedHouse' + i);

      if (i < numClones / 2) {
        clones[i].position.x += offsetPositive; 
        offsetPositive += 3;
      }
      else  {
        clones[i].position.x += offsetNegative; 
        offsetNegative -= 3;
      }
    }
    return clones;

  }

  createMusic(scene: Scene): Sound {
    let music = new Sound("", "assets/playground/sounds/relaxing.mp3", scene, null, { loop: true, autoplay: true });
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
