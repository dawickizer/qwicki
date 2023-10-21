// Core
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {
  IInspectorOptions,
  DebugLayerTab,
  Engine,
  UniversalCamera,
  Viewport,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  Vector3,
  StandardMaterial,
  Texture,
  CubeTexture,
  Color3,
} from '@babylonjs/core';
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import { Subject, takeUntil } from 'rxjs';

// Services/Models
import { FpsService } from 'src/app/services/fps/fps.service';
import { KeyBindService } from 'src/app/services/key-bind/key-bind.service';
import { AuthOrchestratorService } from 'src/app/state/orchestrator/auth.orchestrator.service';
import { AuthService } from 'src/app/state/auth/auth.service';

@Component({
  selector: 'app-babylonjs',
  templateUrl: './babylonjs.component.html',
  styleUrls: ['./babylonjs.component.css'],
})
export class BabylonjsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('drawer') drawer: MatSidenav;
  unsubscribe$ = new Subject<void>();
  engine: Engine;
  scene: Scene;
  universalCamera: UniversalCamera;
  debugCamera: UniversalCamera;
  debugCameraIsActive = false;
  light: HemisphericLight;
  skybox: Mesh;
  ground: Mesh;
  platform: Mesh;
  cameraSensitivity = 0;
  username = '';

  constructor(
    private fpsService: FpsService,
    private authService: AuthService,
    private authOrchestratorService: AuthOrchestratorService,
    private keyBindService: KeyBindService
  ) {}

  // wait for Angular to initialize components before rendering the scene else pixelated rendering happens
  async ngAfterViewInit() {
    this.authService.decodedJwt$.subscribe({
      next: async user => {
        this.username = user.username;

        this.createScene();
        this.handleWindowResize();
        this.handleBoundingBoxes();

        await this.fpsService.addFpsMechanics(
          this.scene,
          this.canvas,
          this.username
        );

        this.skybox = this.createSkyBox();
        //this.ground = this.createGround(4000, 0, 'grass.jpg');
        //this.platform = this.createGround(5000, -200, 'lava.jpg');

        this.handleDebugLayer();
        this.handleDebugCamera();
        this.handleSideNavKeyBind();
        this.handleFullScreen();
        this.getCameraSensitivity();

        // running babylonJS
        this.render();
      },
      error: () =>
        this.authOrchestratorService
          .logout()
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(),
    });
  }

  ngOnDestroy() {
    console.log('Disposing scene');
    this.scene?.dispose();
    this.keyBindService.removeKeyBinds();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createScene() {
    this.engine = new Engine(this.canvas.nativeElement, true);
    this.scene = new Scene(this.engine);
    this.scene.gravity = new Vector3(0, -5, 0);
    this.scene.collisionsEnabled = true;
    this.light = new HemisphericLight(
      'light',
      new Vector3(0, 1, 0),
      this.scene
    );
    this.universalCamera = new UniversalCamera(
      'universalCamera',
      new Vector3(0, 64, 0),
      this.scene
    );
    this.universalCamera.attachControl(this.canvas.nativeElement, true);
    this.scene.activeCamera = this.universalCamera;
    this.debugCamera = new UniversalCamera(
      'debugCamera',
      new Vector3(0, 5, 0),
      this.scene
    );
  }

  createSkyBox(): Mesh {
    const skybox = MeshBuilder.CreateBox('skybox', { size: 5000 }, this.scene);
    const skyboxMaterial = new StandardMaterial('skybox', this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture(
      'assets/babylonjs/textures/night-sky/night-sky',
      this.scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    return skybox;
  }

  createGround(size: number, y_position: number, texture: string): Mesh {
    const ground = MeshBuilder.CreateGround(
      'ground',
      { width: size, height: size },
      this.scene
    );
    ground.position.y = y_position;
    const groundMat = new StandardMaterial('groundMat', this.scene);
    groundMat.backFaceCulling = false;
    groundMat.diffuseTexture = new Texture(
      'assets/babylonjs/textures/' + texture,
      this.scene
    );
    ground.material = groundMat;
    ground.checkCollisions = true;

    // let terrainMaterial = new StandardMaterial("terrain", this.scene);
    // terrainMaterial.diffuseTexture = new Texture("assets/babylonjs/textures/grass.jpg", this.scene);

    // let terrain: GroundMesh;
    // Mesh.CreateGroundFromHeightMap("terrain", "assets/babylonjs/textures/heightmap.jpg", 5000, 5000, 50, 0, 200, this.scene, false, (mesh) => {
    //   terrain = mesh;
    //   terrain.position = new Vector3(0, 0, 0);
    //   terrain.material = terrainMaterial;
    //   terrain.checkCollisions = true;
    //   terrain.physicsImpostor = new PhysicsImpostor(terrain, PhysicsImpostor.HeightmapImpostor, { mass: 0, restitution: 0.9 }, this.scene);
    // });

    return ground;
  }

  getCameraSensitivity() {
    this.cameraSensitivity = this.fpsService.getCameraSensitivity();
  }

  setCameraSensitivity(cameraSensitivity: number) {
    this.fpsService.setCameraSensitivity(cameraSensitivity);
  }

  handleWindowResize() {
    window.addEventListener('resize', () => this.engine.resize());
  }

  handleSideNavKeyBind() {
    this.keyBindService.setKeyBind('keydown', event => {
      if (event.code == 'Tab') {
        event.preventDefault();
        if (this.drawer.opened) this.canvas.nativeElement.requestPointerLock();
        else document.exitPointerLock();
        if (document.fullscreenElement) document.exitFullscreen();
        this.drawer.toggle();
      }
    });
  }

  handleFullScreen() {
    this.keyBindService.setKeyBind('keydown', event => {
      if (event.code == 'Backquote')
        if (!document.fullscreenElement) {
          this.canvas.nativeElement.requestFullscreen();
          this.canvas.nativeElement.requestPointerLock();
          this.drawer.close();
        } else document.exitFullscreen();
    });
  }

  handleDebugLayer() {
    const config: IInspectorOptions = {
      initialTab: DebugLayerTab.Statistics,
      embedMode: true,
    };
    this.keyBindService.setKeyBind('keydown', event => {
      if (event.code == 'NumpadAdd') {
        if (this.scene.debugLayer.isVisible()) this.scene.debugLayer.hide();
        else this.scene.debugLayer.show(config);
      }
    });
  }

  handleDebugCamera() {
    this.keyBindService.setKeyBind('keydown', event => {
      if (event.code == 'NumpadSubtract') {
        this.debugCameraIsActive = !this.debugCameraIsActive;
        if (this.debugCameraIsActive) {
          this.debugCamera.layerMask = 0x10000001; // makes dude visible to debug camera and everything else renders for debug assuming its 0x0FFFFFFF

          // Attach camera to canvas
          this.debugCamera.attachControl(this.canvas.nativeElement, true);

          // Push the debug camera to the list of active cameras for the scene
          this.scene.activeCameras.push(this.debugCamera);

          // Adjust the viewports
          this.scene.activeCameras[0].viewport = new Viewport(0.5, 0, 0.5, 1.0); // FPS Camera
          this.scene.activeCameras[1].viewport =
            this.scene.activeCameras[0].viewport; // Gunsight Camera
          this.scene.activeCameras[2].viewport = this.debugCamera.viewport =
            new Viewport(0, 0, 0.5, 1.0); // Debug Camera
        } else {
          // Revert back to normal camera state
          this.scene.activeCameras[0].viewport = new Viewport(0, 0, 1, 1); // FPS Camera
          this.scene.activeCameras[1].viewport =
            this.scene.activeCameras[0].viewport; // Gunsight Camera

          // Revert back to normal active cameras
          this.debugCamera.detachControl();
          this.scene.activeCameras.pop();
        }
      }
    });
  }

  handleBoundingBoxes() {
    this.keyBindService.setKeyBind('keydown', event => {
      if (event.code == 'NumpadEnter')
        for (let i = 0; i < this.scene.meshes.length; i++)
          this.scene.meshes[i].showBoundingBox =
            !this.scene.meshes[i].showBoundingBox;
    });
  }

  render() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}
