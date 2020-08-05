import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // add http client module

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { TestApiComponent } from './test-api/test-api.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    TestApiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule // import http client module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
