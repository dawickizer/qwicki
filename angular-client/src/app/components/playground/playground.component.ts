import { Component, ElementRef, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { Engine, ArcRotateCamera, HemisphericLight, Mesh, MeshBuilder, AbstractMesh, Scene, Vector3, SceneLoader, Sound, StandardMaterial, Texture } from '@babylonjs/core';
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
  @Output() moon: Mesh;
  @Output() house: AbstractMesh;

  constructor() { }

  async ngOnInit() {

    // Basic starter code to get a scene set up
    this.createScene();

    // Create scene elements
    this.ground = this.createGround(this.scene);
    this.moon = this.createMoon(this.scene);
    this.house = await this.importHouse(this.scene);
    this.music = this.createMusic(this.scene);

    // running babylonJS
    this.render();

  }

  createScene() {
    this.engine = new Engine(this.canvas.nativeElement, true);
    this.scene = new Scene(this.engine);
    this.camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.2, 18, new Vector3(0, 4, 0), this.scene);
    this.camera.attachControl(this.canvas.nativeElement, true);
    this.light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
  }

  createGround(scene: Scene): Mesh {
    let ground = MeshBuilder.CreateGround('ground', {width:10, height:10}, scene);
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

  async importHouse(scene: Scene): Promise<AbstractMesh> {
    let result = await SceneLoader.ImportMeshAsync('', 'assets/playground/models/', 'house.babylon', scene);
    result.meshes[0].position.x = 0;
    result.meshes[0].position.y = 0;
    return result.meshes[0];
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
