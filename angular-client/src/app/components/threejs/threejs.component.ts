import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { exists } from 'src/app/utilities/username.utility';

import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
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
  fpsControls: FirstPersonControls;
  pointerLockControls: PointerLockControls;
  debugCamera: THREE.PerspectiveCamera;
  orbitControls: OrbitControls;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  light: THREE.AmbientLight;
  cube: THREE.Mesh;

  // debug layer
  axesHelper: THREE.AxesHelper;
  debug: dat.GUI;
  debugVisible: boolean = false;
  debugItems: dat.GUI[] = [];
  ground: THREE.Mesh;

  constructor(private fpsService: FpsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getRouteParams();
    this.createScene();
    this.createGround();
    this.handleDebugCamera();
    this.handleDebugLayer();
    this.handleUserInteractions();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {}

  createScene() {

    // renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas.nativeElement });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // scene
    this.scene = new THREE.Scene();
    this.scene.name = 'Scene';

    // fps camera
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 2000;
    this.fpsCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.fpsCamera.position.set(0, 1, 3);
    this.fpsCamera.lookAt(new THREE.Vector3(0, 0, 0));
    this.fpsCamera.name = 'FPS Camera';

    // fps camera controls
    this.fpsControls = new FirstPersonControls(this.fpsCamera, this.canvas.nativeElement);

    // light
    const color = 0xFFFFFF;
    const intensity = 1;
    this.light = new THREE.AmbientLight(color, intensity);
    this.light.position.set(-1, 2, 4);
    this.light.name = 'Light';

    // cube
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/assets/threejs/textures/lava.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.name = 'Cube1';

    // Add to scene
    this.scene.add(this.cube);
    this.scene.add(this.light);
    this.scene.add(this.fpsCamera);

    // render scene
    this.render();
  }

  createGround() {
    const geometry = new THREE.PlaneGeometry(50, 50, 50);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/assets/threejs/textures/grass.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    this.ground = new THREE.Mesh(geometry, material);
    this.ground.rotation.x = Math.PI / 2;
    this.ground.name = 'Ground';
    this.scene.add(this.ground);
  }

  render() {
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      this.orbitControls.update();
      if (this.fpsCameraIsActive) this.renderer.render(this.scene, this.fpsCamera);
      else this.renderer.render(this.scene, this.debugCamera);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  getRouteParams() {
    this.route.queryParams.subscribe(params => this.username = exists(params['username']));
  }

  handleUserInteractions() {
    document.documentElement.style.overflow = 'hidden';
    this.pointerLockControls = new PointerLockControls(this.fpsCamera, this.canvas.nativeElement);
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

    this.axesHelper = new THREE.AxesHelper();
    this.axesHelper.name = "AxesHelper";
    this.axesHelper.visible = false;
    this.axesHelper.scale.multiply(new THREE.Vector3(5, 5, 5));
    this.scene.add(this.axesHelper);

    this.createDebugGUI(this.scene);

    document.addEventListener('keydown', event => { 
      if (event.code == 'NumpadAdd') {
        if (this.debugVisible) {
          this.debug.hide();
          this.axesHelper.visible = false;
        } else {
          this.debug.show();
          this.axesHelper.visible = true;
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
    this.debugCamera.position.set(0, 5, 10);
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