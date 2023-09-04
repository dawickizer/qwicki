import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { BabylonjsComponent } from './components/babylonjs/babylonjs.component';
import { AuthGuardService } from './services/auth/auth.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SocialSidenavComponent } from './components/social-sidenav/social-sidenav.component';
import { GameComponent } from './components/game/game.component';

const routes: Routes = [
  {
    path: '',
    component: SocialSidenavComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
    ],
  },
  { path: 'game', component: GameComponent, canActivate: [AuthGuardService] },
  {
    path: 'babylonjs',
    component: BabylonjsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuardService],
  },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
