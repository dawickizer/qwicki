import { Component, OnInit } from '@angular/core';
import * as BabylonViewer from '@babylonjs/viewer';

@Component({
  selector: 'app-test-babylon',
  templateUrl: './test-babylon.component.html',
  styleUrls: ['./test-babylon.component.css']
})
export class TestBabylonComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    BabylonViewer.viewerManager.getViewerPromiseById('babylon-viewer').then(function (viewer) {
      console.log(viewer);
      // this will resolve only after the viewer with this specific ID is initialized
      viewer.onEngineInitObservable.add(function (scene) {
        console.log(scene);
        viewer.loadModel({
            title: "Helmet",
            subtitle: "BabylonJS",
            url: "https://www.babylonjs.com/Assets/DamagedHelmet/glTF/DamagedHelmet.gltf"
        });
      });
    });
    BabylonViewer.InitTags("my-tag");
  }
}
