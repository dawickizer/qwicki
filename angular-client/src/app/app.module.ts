import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // add http client module

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { PhaserioComponent } from './components/phaserio/phaserio.component';
import { BabylonjsComponent } from './components/babylonjs/babylonjs.component';
import { ThreejsComponent } from './components/threejs/threejs.component';
import { SocketioComponent } from './components/socketio/socketio.component';
import { ApiComponent } from './components/api/api.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Services
import { SocketioService } from './services/socketio/socketio.service';
import { ApiService } from './services/api/api.service';
import { PlayerService } from './services/player/player.service';
import { GunService } from './services/gun/gun.service';
import { FpsService } from './services/fps/fps.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    PhaserioComponent,
    BabylonjsComponent,
    ThreejsComponent,
    SocketioComponent,
    ApiComponent
  ],
  imports: [
    BrowserModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatSidenavModule,
    MatSliderModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, // import http client module
  ],
  providers: [
              SocketioService,
              ApiService,
              PlayerService,
              GunService,
              FpsService
            ],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
