import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { TestApiComponent } from './test-api/test-api.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'test-api', component: TestApiComponent },
  { path: 'chat', component: ChatComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
