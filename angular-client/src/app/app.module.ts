import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // add http client module

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestPhaserComponent } from './components/test-phaser/test-phaser.component';
import { TestBabylonComponent } from './components/test-babylon/test-babylon.component';
import { TestApiComponent } from './components/test-api/test-api.component';
import { TestSocketComponent } from './components/test-socket/test-socket.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Services
import { SocketService } from './services/socket/socket.service';
import { ApiService } from './services/api/api.service';

@NgModule({
  declarations: [
    AppComponent,
    TestPhaserComponent,
    TestBabylonComponent,
    TestApiComponent,
    TestSocketComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, // import http client module
  ],
  providers: [SocketService,
              ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
