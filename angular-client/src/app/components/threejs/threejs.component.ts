import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { exists } from 'src/app/utilities/username.utility';

import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// Services/Models
import { Gun } from 'src/app/models/gun/gun';
import { FpsService } from 'src/app/services/fps/fps.service';

@Component({
  selector: 'app-threejs',
  templateUrl: './threejs.component.html',
  styleUrls: ['./threejs.component.css']
})
export class ThreejsComponent implements OnInit {

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('drawer') drawer: MatSidenav;

  username: string = 'Wick';
  cameraSensitivity: number = 50;
  fpsCameraIsActive: boolean = true;
  fpsCamera: THREE.PerspectiveCamera;
  pointerLockControls: PointerLockControls;
  debugCamera: THREE.PerspectiveCamera;
  orbitControls: OrbitControls;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  light: THREE.HemisphereLight;

  // debug layer
  axesHelper: THREE.AxesHelper;
  gridHelperX: THREE.GridHelper;
  gridHelperY: THREE.GridHelper;
  debug: dat.GUI;
  debugVisible: boolean = false;
  debugItems: dat.GUI[] = [];

  ground: THREE.Mesh;
  cubes: THREE.Mesh[] = [];

  raycaster: THREE.Raycaster;
  moveForward: boolean = false;
  moveBackward: boolean = false;
  moveLeft: boolean = false;
  moveRight: boolean = false;
  canJump: boolean = false;
  sprint: boolean = false;

  prevTime: number;
  velocity = new THREE.Vector3();
  direction = new THREE.Vector3();
  vertex = new THREE.Vector3();
  color = new THREE.Color();

  constructor(private fpsService: FpsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getRouteParams();
    this.createScene();
    this.createGround();
    this.createBoxes();
    this.handleDebugCamera();
    this.handleDebugLayer();
    this.handleUserInteractions();
    this.handleMovementKeys();

    // render scene
    this.render();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {}

  createScene() {

    // renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas.nativeElement, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);


    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.scene.fog = new THREE.Fog(0xffffff, 0, 750);
    this.scene.name = 'Scene';

    // fps camera
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 2000;
    this.fpsCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.fpsCamera.position.set(0, 10, 0);
    this.fpsCamera.name = 'FPS Camera';
    this.pointerLockControls = new PointerLockControls(this.fpsCamera, this.canvas.nativeElement);

    this.light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    this.light.position.set(0.5, 1, 0.75);
    this.light.name = "Light";

    // Add to scene;
    this.scene.add(this.pointerLockControls.getObject());
    this.scene.add(this.light);

  }

  createGround() {
    let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    floorGeometry.rotateX(- Math.PI / 2);

    // vertex displacement
    let position = floorGeometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      this.vertex.fromBufferAttribute(position, i);

      this.vertex.x += Math.random() * 20 - 10;
      this.vertex.y += Math.random() * 2;
      this.vertex.z += Math.random() * 20 - 10;

      position.setXYZ(i, this.vertex.x, this.vertex.y, this.vertex.z);
    }

    floorGeometry = floorGeometry.toNonIndexed() as THREE.PlaneGeometry; // ensure each face has unique vertices

    position = floorGeometry.attributes.position;
    const colorsFloor = [];

    for (let i = 0; i < position.count; i ++) {
      this.color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
      colorsFloor.push(this.color.r, this.color.g, this.color.b);
    }

    floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute( colorsFloor, 3 ));

    const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });

    this.ground = new THREE.Mesh(floorGeometry, floorMaterial);
    this.ground.name = "Ground";
    this.scene.add(this.ground);
  }

  createBoxes() {
    const boxGeometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed();

    let position = boxGeometry.attributes.position;
    const colorsBox = [];

    for (let i = 0; i < position.count; i ++) {
      this.color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
      colorsBox.push( this.color.r, this.color.g, this.color.b );
    }

    boxGeometry.setAttribute('color', new THREE.Float32BufferAttribute( colorsBox, 3 ));

    for (let i = 0; i < 500; i ++) {
      const boxMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, flatShading: true, vertexColors: true });
      boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
      box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
      box.position.z = Math.floor(Math.random() * 20 - 10) * 20;
      box.name = `Cube${i}`;
      this.scene.add(box);
      this.cubes.push(box);
    }

  }

  
  handleMovement(time: number) {

    if (this.pointerLockControls.isLocked) {
      this.raycaster.ray.origin.copy(this.pointerLockControls.getObject().position);
      this.raycaster.ray.origin.y -= 10;

      const intersections = this.raycaster.intersectObjects(this.cubes);

      const onObject = intersections.length > 0;

      const delta = (time - this.prevTime) / 1000;

      this.velocity.x -= this.velocity.x * 8.0 * delta;
      this.velocity.z -= this.velocity.z * 8.0 * delta;

      this.velocity.y -= 9.8 * 130 * delta; // 100.0 = mass

      this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
      this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
      this.direction.normalize(); // this ensures consistent movements in all directions

      // movement speed
      if ((this.moveLeft || this.moveRight || this.moveForward || this.moveBackward) && this.sprint) {
        this.velocity.x -= this.direction.x * 600.0 * delta;
        this.velocity.z -= this.direction.z * 600.0 * delta;
      }
      if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * 400.0 * delta;
      if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 400.0 * delta;

      if (onObject) {
        this.velocity.y = Math.max(0, this.velocity.y);
        this.canJump = true;
      }

      this.pointerLockControls.moveRight(- this.velocity.x * delta);
      this.pointerLockControls.moveForward(- this.velocity.z * delta);

      this.pointerLockControls.getObject().position.y += (this.velocity.y * delta); // new behavior

      if (this.pointerLockControls.getObject().position.y < 10) {
        this.velocity.y = 0;
        this.pointerLockControls.getObject().position.y = 10;
        this.canJump = true;
      }

    }
  }

  render() {
    this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
    this.prevTime = performance.now();
    let animate = () => {
      requestAnimationFrame(animate);
      const time = performance.now();

      this.handleMovement(time);
  
      this.prevTime = time;
  
      this.orbitControls.update();
      if (this.fpsCameraIsActive) this.renderer.render(this.scene, this.fpsCamera);
      else this.renderer.render(this.scene, this.debugCamera);

    }
    requestAnimationFrame(animate);
  }

  getRouteParams() {
    this.route.queryParams.subscribe(params => this.username = exists(params['username']));
  }

  handleUserInteractions() {
    document.documentElement.style.overflow = 'hidden';
    this.handleWindowResize();
    this.handlePointerEvents();
    this.handleFullScreen();
    this.handleSideNav();
  }
  
  handleWindowResize() {
    window.addEventListener('resize', () => {
      this.debugCamera.aspect = window.innerWidth / window.innerHeight;
      this.debugCamera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });   
  }

  handleFullScreen() {
    document.addEventListener('keydown', event => {
      if (event.code == 'Backquote' && this.fpsCameraIsActive)
        if (!document.fullscreenElement) {
          this.canvas.nativeElement.requestFullscreen();
          this.pointerLockControls.lock();
          this.drawer.close();
        }
        else document.exitFullscreen();
    });
  }

  handleSideNav() {
    document.addEventListener('keydown', event => { 
      if (event.code == 'Tab' && this.fpsCameraIsActive) {
        event.preventDefault();
        if (this.drawer.opened) this.pointerLockControls.lock();
        else this.pointerLockControls.unlock();
        if (document.fullscreenElement) document.exitFullscreen();
        this.drawer.toggle();
      }
    });  
  }

  handlePointerEvents() {
    this.canvas.nativeElement.addEventListener('pointerdown',  event => {
      if (!this.pointerLockControls.isLocked && event.button == 0 && this.fpsCameraIsActive) this.pointerLockControls.lock();
      else if (this.pointerLockControls.isLocked && event.button == 0) console.log('Fire Weapon');
    });
    this.canvas.nativeElement.addEventListener('pointerup',  event => { if (this.pointerLockControls.isLocked && event.button == 0) console.log('Setting self.canShoot to false') });

    this.pointerLockControls.addEventListener('lock', () => this.scrollWindowToBottom());
    this.pointerLockControls.addEventListener('unlock', () =>  this.scrollWindowToTop());
  }

  handleMovementKeys() {

    let onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          this.moveForward = true;
          break;
        case 'KeyA':
          this.moveLeft = true;
          break;
        case 'KeyS':
          this.moveBackward = true;
          break;
        case 'KeyD':
          this.moveRight = true;
          break;
        case 'Space':
          if ( this.canJump === true ) this.velocity.y += 350;
          this.canJump = false;
          break;
        case 'ShiftLeft':
          this.sprint = true;
          break;
      }
    };

    let onKeyUp = (event: KeyboardEvent) => {
					switch (event.code) {
						case 'KeyW':
							this.moveForward = false;
							break;
						case 'KeyA':
							this.moveLeft = false;
							break;
						case 'KeyS':
							this.moveBackward = false;
							break;
						case 'KeyD':
							this.moveRight = false;
							break;
            case 'ShiftLeft':
              this.sprint = false;
              break;
					}
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);  
  }

  scrollWindowToBottom() {
   window.scrollTo(0, document.body.scrollHeight);
  }

  scrollWindowToTop() {
   window.scrollTo(0, 0);
  }

  handleDebugLayer() {
    this.debug = new dat.GUI({hideable: false});
    this.debug.hide();
    document.getElementById('debug').append(this.debug.domElement); // append to empty div to prevent debugger from appearing behind sidenav

    this.axesHelper = new THREE.AxesHelper(100);
    this.axesHelper.name = "AxesHelper";
    this.axesHelper.visible = false;
    this.scene.add(this.axesHelper);

    this.gridHelperX = new THREE.GridHelper(500, 500);
    this.gridHelperX.name = "GridHelperX";
    this.gridHelperX.visible = false;
    this.scene.add(this.gridHelperX);

    this.gridHelperY = new THREE.GridHelper(500, 500);
    this.gridHelperY.name = "GridHelperY";
    this.gridHelperY.visible = false;
    this.gridHelperY.rotation.x = Math.PI / 2;
    this.scene.add(this.gridHelperY);

    //this.createDebugGUI(this.scene);

    document.addEventListener('keydown', event => { 
      if (event.code == 'NumpadAdd') {
        if (this.debugVisible) {
          this.debug.hide();
          this.axesHelper.visible = false;
          this.gridHelperX.visible = false;
          this.gridHelperY.visible = false;
        } else {
          this.debug.show();
          this.axesHelper.visible = true;
          this.gridHelperX.visible = true;
          this.gridHelperY.visible = true;
        }
        this.debugVisible = !this.debugVisible;
        this.pointerLockControls.unlock();
      }
    });
  }

  createDebugGUI(parent: THREE.Object3D) {
    parent.children.forEach(child => this.createDebugGUI(child));
    let folder = this.debug.addFolder(`${parent.name}: ${parent.type}`);

    // position, rotation/quaternion, scaling
    folder.add(parent, 'visible');
    folder.add(parent.position, 'x').min(-5).max(5).step(0.01).name('pos_x');
    folder.add(parent.position, 'y').min(-5).max(5).step(0.01).name('pos_y');
    folder.add(parent.position, 'z').min(-5).max(5).step(0.01).name('pos_z');
    folder.add(parent.rotation, 'x').min(-5).max(5).step(0.01).name('rot_x');
    folder.add(parent.rotation, 'y').min(-5).max(5).step(0.01).name('rot_y');
    folder.add(parent.rotation, 'z').min(-5).max(5).step(0.01).name('rot_z');
    folder.add(parent.quaternion, 'x').min(-5).max(5).step(0.01).name('quat_x');
    folder.add(parent.quaternion, 'y').min(-5).max(5).step(0.01).name('quat_y');
    folder.add(parent.quaternion, 'z').min(-5).max(5).step(0.01).name('quat_z');
    folder.add(parent.quaternion, 'w').min(-5).max(5).step(0.01).name('quat_w');
    folder.add(parent.scale, 'x').min(-5).max(5).step(0.01).name('scale_x');
    folder.add(parent.scale, 'y').min(-5).max(5).step(0.01).name('scale_y');
    folder.add(parent.scale, 'z').min(-5).max(5).step(0.01).name('scale_z');

    // check if light
    if (parent instanceof THREE.Light) {
      folder.add(parent, 'intensity').min(-5).max(5).step(0.01).name('intensity');
      folder.add(parent, 'castShadow');
    }

    // check if mesh
    if (parent instanceof THREE.Mesh) {
      if (Array.isArray(parent.material)) parent.material.forEach(material => folder.add(parent.material, 'wireframe'))
      else folder.add(parent.material, 'wireframe');
    }

    //check if...

    this.debugItems.push(folder);
    return folder;
  }

  handleDebugCamera() {
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 2000;
    this.debugCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.debugCamera.position.set(0, 100, 300);
    this.debugCamera.lookAt(new THREE.Vector3(0, 0, 0));
    this.debugCamera.name = 'Debug Camera';

    this.orbitControls = new OrbitControls(this.debugCamera, this.canvas.nativeElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = .05;

    this.scene.add(this.debugCamera);

    document.addEventListener('keydown', event => { 
      if (event.code == 'NumpadSubtract') {
        if (this.fpsCameraIsActive) this.pointerLockControls.unlock();
        else this.pointerLockControls.lock();
        this.fpsCameraIsActive = !this.fpsCameraIsActive;
      }
    });
  }

}