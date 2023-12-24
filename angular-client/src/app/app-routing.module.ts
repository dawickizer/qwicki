import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { BabylonjsComponent } from './components/game/babylonjs/babylonjs.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { GameComponent } from './components/game/game/game.component';
import { AuthGuardService } from './state/auth/auth.guard.service';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomGameMatchMakingComponent } from './components/match-making/custom-game-match-making/custom-game-match-making.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      // Define child routes here that should render within the  layout
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'custom-game',
        component: CustomGameMatchMakingComponent,
      },
      {
        path: 'game',
        component: GameComponent,
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
      },
      // ... other routes that should use the layout
    ],
  },
  // routes defined outside the layout
  {
    path: 'babylonjs',
    canActivate: [AuthGuardService],
    component: BabylonjsComponent,
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
    ],
  },
  // Catch-all wildcard route for 404 Not Found page
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
