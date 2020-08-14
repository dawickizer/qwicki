import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { TestApiComponent } from './test-api/test-api.component';

const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'test-api', component: TestApiComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
