import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { TestBabylonComponent } from './components/test-babylon/test-babylon.component';
import { TestApiComponent } from './components/test-api/test-api.component';
import { TestSocketComponent } from './components/test-socket/test-socket.component';

const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'test-babylon', component: TestBabylonComponent },
  { path: 'test-api', component: TestApiComponent },
  { path: 'test-socket', component: TestSocketComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
