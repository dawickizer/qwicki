import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { PhaserioComponent } from './components/phaserio/phaserio.component';
import { BabylonjsComponent } from './components/babylonjs/babylonjs.component';
import { ThreejsComponent } from './components/threejs/threejs.component';
import { AuthGuardService } from './services/auth/auth.service';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
  { 
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent }
    ]
  },
  { path: 'phaserio', component: PhaserioComponent, canActivate: [AuthGuardService] },
  { path: 'babylonjs', component: BabylonjsComponent, canActivate: [AuthGuardService] },
  { path: 'threejs', component: ThreejsComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
