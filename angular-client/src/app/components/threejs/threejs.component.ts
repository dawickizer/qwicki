import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { exists } from 'src/app/utilities/username.utility';

import * as THREE from 'three';

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

  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  light: THREE.DirectionalLight;
  cube: THREE.Mesh;

  constructor(private fpsService: FpsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.createScene();
    this.handleWindowResize();
  }

  // wait for Angular to initialize components before rendering the scene else pixelated rendering happens
  ngAfterViewInit() {
 

  }

  createScene() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas.nativeElement });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 0, 2);

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish const 
    this.cube = new THREE.Mesh(geometry, material);

    const color = 0xFFFFFF;
    const intensity = 1;
    this.light = new THREE.DirectionalLight(color, intensity);
    this.light.position.set(-1, 2, 4);

    this.scene.add(this.cube);
    this.scene.add(this.light);

    const render = (time) => {
      time *= 0.001;  // convert time to seconds

      this.cube.rotation.x = time;
      this.cube.rotation.y = time;
  
      this.renderer.render(this.scene, this.camera);
  
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

  }
  
  handleWindowResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
    });   
  }
  
  ngOnDestroy() {}

}