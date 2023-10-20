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
  Engine,
  UniversalCamera,
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
import { ActivatedRoute } from '@angular/router';

// Services
import { KeyBindService } from 'src/app/services/key-bind/key-bind.service';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';

// Models
import { Player } from 'src/app/models/player/player';
import { PlayerService } from 'src/app/services/player/player.service';
import { AuthService } from 'src/app/state/auth/auth.service';
import { AuthFlowService } from 'src/app/state/auth/auth.flow.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('drawer') drawer: MatSidenav;

  engine: Engine;
  scene: Scene;
  universalCamera: UniversalCamera;
  light: HemisphericLight;
  skybox: Mesh;
  ground: Mesh;
  username = '';
  self: Player;
  enemies: Map<string, Player> = new Map();
  gunSightCamera: UniversalCamera;
  gunSight: Mesh;
  isSceneLocked = false;
  sprintSpeed = 130;
  walkSpeed = 80;
  crouchSpeed = 40;

  constructor(
    private route: ActivatedRoute,
    private matchMakingService: MatchMakingService,
    private playerService: PlayerService,
    private authService: AuthService,
    private keyBindService: KeyBindService,
    private authFlowService: AuthFlowService
  ) {}

  // wait for Angular to initialize components before rendering the scene else pixelated rendering happens
  async ngAfterViewInit() {
    this.authService.decodedJwt$.subscribe({
      next: async user => {
        this.route.queryParams.subscribe(async params => {
          this.createScene();
          this.skybox = this.createSkyBox();
          this.ground = this.createGround(4000, 0, 'grass.jpg');
          this.handleWindowResize();
          this.createFpsCamera();
          this.self = new Player(user._id, null, user.username, 'self');
          this.handlePointerEvents();
          this.handlePlayerPosition();
          this.render();

          await this.createOrJoinGameRoom(params);
          this.playersOnAdd();
          this.playerOnRemove();
        });
      },
      error: () => this.authFlowService.logout(),
    });
  }

  ngOnDestroy() {
    console.log('Disposing scene');
    this.scene?.dispose();
    this.keyBindService.removeKeyBinds();
  }

  async createOrJoinGameRoom(params: any) {
    if (params['connection'] === 'create')
      await this.matchMakingService.createGameRoom();
    else if (params['connection'] === 'join')
      await this.matchMakingService.joinGameRoom();
  }

  playersOnAdd() {
    this.matchMakingService.game.room.state.players.onAdd = async (
      player: any
    ) => {
      if (this.self._id === player._id) {
        this.self = await this.createPlayer(player, 'self');
        this.playerPositionOnChange(player, this.self);
        this.playerRotationOnChange(player, this.self);
      } else {
        this.enemies.set(player._id, await this.createPlayer(player, 'enemy'));
        this.playerPositionOnChange(player, this.enemies.get(player._id));
        this.playerRotationOnChange(player, this.enemies.get(player._id));
      }
    };
  }

  playerPositionOnChange(playerState: any, player: Player) {
    playerState.position.onChange = () => {
      player.nextPosition = new Vector3(
        playerState.position.x,
        playerState.position.y - 64.32,
        playerState.position.z
      );
    };
    playerState.position.triggerAll();
  }

  playerRotationOnChange(playerState: any, player: Player) {
    playerState.rotation.onChange = () => {
      player.nextRotation = new Vector3(
        playerState.rotation.x,
        playerState.rotation.y,
        playerState.rotation.z
      );
    };
    playerState.rotation.triggerAll();
  }

  playerOnRemove() {
    this.matchMakingService.game.room.state.players.onRemove = async (
      player: any
    ) =>
      this.disposePlayer(
        this.self._id === player._id ? this.self : this.enemies.get(player._id)
      );
  }

  async createPlayer(joinedPlayer: any, name: string) {
    const player: Player = new Player(
      joinedPlayer._id,
      joinedPlayer.sessionId,
      joinedPlayer.username,
      name
    );
    player.playerMeshURL = 'assets/babylonjs/models/dude/dude.babylon';
    player.moveSpeed = this.universalCamera.speed;
    player.cameraAngularSensibility = this.universalCamera.angularSensibility;
    player.cameraInertia = this.universalCamera.inertia;
    await player.importPlayerMesh(this.scene);
    player.position = new Vector3(0, 0, -5); // offset dude forward in the Z direction
    player.nextPosition = player.position;
    player.nextRotation = player.rotation;
    player.playerMesh.bakeCurrentTransformIntoVertices(); // make new default 0,0,0 position
    return player;
  }

  async disposePlayer(player: Player) {
    player.dispose();
    if (this.self._id === player._id) this.self = null;
    else this.enemies.delete(player._id);
    console.log(this.self);
    console.log(this.enemies);
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
    return ground;
  }

  handlePlayerPosition() {
    this.scene.beforeCameraRender = () => {
      if (this.self && this.self.position && this.self.playerMesh) {
        this.self.position = Vector3.Lerp(
          this.self.position,
          this.self.nextPosition,
          0.05
        );
        this.self.position = new Vector3(
          this.universalCamera.position.x,
          this.universalCamera.position.y - 64.32,
          this.universalCamera.position.z
        );
        this.self.playerMesh.rotation = this.universalCamera.rotation;
      }
      if (this.enemies.size > 0)
        this.enemies.forEach(enemy => {
          enemy.position = Vector3.Lerp(
            enemy.position,
            enemy.nextPosition,
            0.05
          );
          enemy.rotation = Vector3.Lerp(
            enemy.rotation,
            enemy.nextRotation,
            0.05
          );
        });
      // this.self.playerMesh.position = this.universalCamera.position;
      // this.self.playerMesh.rotation = this.universalCamera.rotation;
    };
  }

  createFpsCamera() {
    this.universalCamera.checkCollisions = true;
    this.universalCamera.applyGravity = true;
    this.universalCamera.ellipsoid = new Vector3(5, 32, 5);

    this.universalCamera.keysUp = [];
    this.universalCamera.keysUp.push('w'.charCodeAt(0));
    this.universalCamera.keysUp.push('W'.charCodeAt(0));
    this.keyBindService.setKeyBind('keydown', event => {
      if (this.isSceneLocked && event.code == 'KeyW') this.move();
    });

    this.universalCamera.keysLeft = [];
    this.universalCamera.keysLeft.push('a'.charCodeAt(0));
    this.universalCamera.keysLeft.push('A'.charCodeAt(0));
    this.keyBindService.setKeyBind('keydown', event => {
      if (this.isSceneLocked && event.code == 'KeyA') this.move();
    });

    this.universalCamera.keysDown = [];
    this.universalCamera.keysDown.push('s'.charCodeAt(0));
    this.universalCamera.keysDown.push('S'.charCodeAt(0));
    this.keyBindService.setKeyBind('keydown', event => {
      if (this.isSceneLocked && event.code == 'KeyS') this.move();
    });

    this.universalCamera.keysRight = [];
    this.universalCamera.keysRight.push('d'.charCodeAt(0));
    this.universalCamera.keysRight.push('D'.charCodeAt(0));
    this.keyBindService.setKeyBind('keydown', event => {
      if (this.isSceneLocked && event.code == 'KeyD') this.move();
    });

    this.keyBindService.setKeyBind('mousemove', () => {
      if (this.isSceneLocked) this.rotate();
    });

    this.universalCamera.speed = this.walkSpeed; // controls WASD speed
    this.universalCamera.angularSensibility = 5000; // controls mouse speed
    this.universalCamera.inertia = 0.2; // controls 'smoothness'
  }

  move() {
    // as of now this is the only way i can figure to wait to send the camera position until after its updated due to
    // document listeners firing off before babylon updates its stuff
    setTimeout(
      () =>
        this.matchMakingService.game.room.send(
          'move',
          this.universalCamera.position
        ),
      50
    );
  }

  rotate() {
    // as of now this is the only way i can figure to wait to send the camera position until after its updated due to
    // document listeners firing off before babylon updates its stuff
    setTimeout(
      () =>
        this.matchMakingService.game.room.send(
          'rotate',
          this.universalCamera.rotation
        ),
      50
    );
  }

  walk() {
    this.universalCamera.speed = this.walkSpeed;
  }

  handlePointerEvents() {
    // Hide and lock mouse cursor when scene is clicked
    this.scene.onPointerDown = event => {
      if (!this.isSceneLocked)
        this.canvas.nativeElement.requestPointerLock(); // lock the screen if left mouse clicked and screen not locked
      else if (this.isSceneLocked && event.button == 0)
        console.log('screen locked'); // screen is locked...fire weapon
    };

    this.scene.onPointerUp = event => {
      if (event.button == 0) this.self.canShoot = false;
    };

    // Toggle state of pointer lock so that requestPointerLock does not get called repetitively and handle window state
    this.handlePointerLockChange();
  }

  handlePointerLockChange() {
    // Toggle state of pointer lock so that requestPointerLock does not get called repetitively and handle window state
    this.keyBindService.setKeyBind('pointerlockchange', () => {
      if (document.pointerLockElement) {
        this.isSceneLocked = true;
        this.unloadScrollBars();
        this.scrollWindowToBottom();
      } else {
        this.isSceneLocked = false;
        this.reloadScrollBars();
        this.scrollWindowToTop();
      }
    });
  }

  reloadScrollBars() {
    document.documentElement.style.overflow = 'auto'; // firefox, chrome
  }

  unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden'; // firefox, chrome
  }

  scrollWindowToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  scrollWindowToTop() {
    window.scrollTo(0, 0);
  }

  handleWindowResize() {
    window.addEventListener('resize', () => this.engine.resize());
  }

  render() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}
