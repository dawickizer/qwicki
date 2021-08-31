import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table'

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PhaserioComponent } from './components/phaserio/phaserio.component';
import { BabylonjsComponent } from './components/babylonjs/babylonjs.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Services
import { SocketioService } from './services/socketio/socketio.service';
import { UserService } from './services/user/user.service';
import { AuthGuardService, AuthInterceptor, AuthService } from './services/auth/auth.service';
import { PlayerService } from './services/player/player.service';
import { GunService } from './services/gun/gun.service';
import { FpsService } from './services/fps/fps.service';
import { KeyBindService } from './services/key-bind/key-bind.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    PhaserioComponent,
    BabylonjsComponent,
    LoginComponent,
    SignupComponent,
    NotFoundComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatTableModule,
    MatButtonModule,
    MatSidenavModule,
    MatSliderModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
              SocketioService,
              UserService,
              AuthService,
              AuthGuardService,
              PlayerService,
              GunService,
              FpsService,
              KeyBindService,
              { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
            ],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
