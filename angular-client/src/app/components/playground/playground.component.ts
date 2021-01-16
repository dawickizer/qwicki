import { Component, ElementRef, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { Engine, ArcRotateCamera, HemisphericLight, Mesh, MeshBuilder, AbstractMesh, Scene, Vector3, SceneLoader, Sound } from '@babylonjs/core';
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
  @Output() house: AbstractMesh;

  constructor() { }

  ngOnInit(): void {

    // Basic starter code to get a scene set up
    this.engine = new Engine(this.canvas.nativeElement, true);
    this.scene = new Scene(this.engine);
    this.camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0), this.scene);
    this.camera.attachControl(this.canvas.nativeElement, true);
    this.light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
    this.ground = MeshBuilder.CreateGround('ground', {width:10, height:10}, this.scene);

    // Import a premade mesh from assets
    SceneLoader.ImportMeshAsync('', 'assets/playground/', 'house.babylon').then(
      (result) => {
        result.meshes[0].position.x = 0;
        result.meshes[0].position.y = 0;
        this.house = result.meshes[0];
    });

    // Add music to the scene
    this.music = new Sound("", "assets/playground/relaxing.mp3", this.scene, null, { loop: true, autoplay: true });
    this.music.setVolume(.1);

    // running babylonJS
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

  }

  ngOnDestroy(): void {

    // Stop the music and dispose of it on navigating away from component
    this.music.dispose();
  }

}
