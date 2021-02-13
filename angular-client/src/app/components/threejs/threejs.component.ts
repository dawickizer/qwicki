import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { exists } from 'src/app/utilities/username.utility';

import * as THREE from 'three';
import { WebGL1Renderer, PerspectiveCamera, Scene, DirectionalLight, Mesh, AxesHelper } from 'three';
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
  pointerLockControls: PointerLockControls;

  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  scene: THREE.Scene;
  light: THREE.AmbientLight;
  cube: THREE.Mesh;
  axesHelper: THREE.AxesHelper;

  constructor(private fpsService: FpsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getRouteParams();
    this.createScene();
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

    // camera
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 0, 2);

    // camera controls
    this.controls = new OrbitControls(this.camera, this.canvas.nativeElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = .05

    // light
    const color = 0xFFFFFF;
    const intensity = 1;
    this.light = new THREE.AmbientLight(color, intensity);
    this.light.position.set(-1, 2, 4);

    // cube
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish const 
    this.cube = new THREE.Mesh(geometry, material);

    // Add to scene
    this.scene.add(this.cube);
    this.scene.add(this.light);

    // render scene
    this.render();
  }

  render() {
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  getRouteParams() {
    this.route.queryParams.subscribe(params => this.username = exists(params['username']));
  }

  handleUserInteractions() {
    document.documentElement.style.overflow = 'hidden';
    this.pointerLockControls = new PointerLockControls(this.camera, this.canvas.nativeElement);
    this.handleWindowResize();
    this.handlePointerEvents();
    this.handleFullScreen();
    this.handleSideNav();
  }
  
  handleWindowResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });   
  }

  
  handleFullScreen() {
    document.addEventListener('keydown', event => {
      if (event.code == 'Backquote')
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
      if (event.code == 'Tab') {
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
      if (!this.pointerLockControls.isLocked) this.pointerLockControls.lock();
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

}