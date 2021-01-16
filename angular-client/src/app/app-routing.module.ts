import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestPhaserComponent } from './components/test-phaser/test-phaser.component';
import { TestBabylonComponent } from './components/test-babylon/test-babylon.component';
import { TestApiComponent } from './components/test-api/test-api.component';
import { TestSocketComponent } from './components/test-socket/test-socket.component';
import { PlaygroundComponent } from './components/playground/playground.component';

const routes: Routes = [
  { path: 'test-phaser', component: TestPhaserComponent },
  { path: 'test-babylon', component: TestBabylonComponent },
  { path: 'test-api', component: TestApiComponent },
  { path: 'test-socket', component: TestSocketComponent },
  { path: 'playground', component: PlaygroundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
