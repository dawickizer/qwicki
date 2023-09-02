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
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

// CDK
import { DragDropModule } from '@angular/cdk/drag-drop';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { BabylonjsComponent } from './components/babylonjs/babylonjs.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialSidenavComponent } from './components/social-sidenav/social-sidenav.component';
import { SocialChatBoxComponent } from './components/social-chat-box/social-chat-box.component';
import { SocialCellComponent } from './components/social-cell/social-cell.component';
import { SocialFriendsListComponent } from './components/social-friends-list/social-friends-list.component';
import { SocialFriendRequestsListComponent } from './components/social-friend-requests-list/social-friend-requests-list.component';
import { SocialFriendsTabComponent } from './components/social-friends-tab/social-friends-tab.component';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { JoinGameComponent } from './components/join-game/join-game.component';
import { GameComponent } from './components/game/game.component';

// Directives
import { BorderDirective } from './directives/border.directive';

// Services
import { UserService } from './services/user/user.service';
import {
  AuthGuardService,
  AuthInterceptor,
  AuthService,
} from './services/auth/auth.service';
import { PlayerService } from './services/player/player.service';
import { GunService } from './services/gun/gun.service';
import { FpsService } from './services/fps/fps.service';
import { KeyBindService } from './services/key-bind/key-bind.service';
import { SocialService } from './services/social/social.service';
import { ColyseusService } from './services/colyseus/colyseus.service';
import { InactivityService } from './services/inactivity/inactivity.service';
import { MatchMakingService } from './services/match-making/match-making.service';
import { GameService } from './services/game/game.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    BabylonjsComponent,
    LoginComponent,
    SignupComponent,
    NotFoundComponent,
    UserProfileComponent,
    SocialSidenavComponent,
    SocialChatBoxComponent,
    SocialCellComponent,
    SocialFriendsListComponent,
    SocialFriendRequestsListComponent,
    CreateGameComponent,
    JoinGameComponent,
    GameComponent,
    BorderDirective,
    SocialFriendsTabComponent,
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
    MatTabsModule,
    MatButtonModule,
    MatSidenavModule,
    MatSliderModule,
    MatExpansionModule,
    MatTooltipModule,
    MatTabsModule,
    DragDropModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    UserService,
    AuthService,
    AuthGuardService,
    InactivityService,
    ColyseusService,
    PlayerService,
    GunService,
    FpsService,
    GameService,
    KeyBindService,
    SocialService,
    MatchMakingService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
