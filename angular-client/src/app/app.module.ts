import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  AuthFlowService,
  AuthGuardService,
  AuthInterceptor,
  AuthService,
} from './services/auth/auth.service';
import { AuthStateService } from './state/auth/auth.state.service';
import { BabylonjsComponent } from './components/babylonjs/babylonjs.component';
import { BorderDirective } from './directives/border.directive';
import { ColyseusService } from './services/colyseus/colyseus.service';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { FpsService } from './services/fps/fps.service';
import { FriendApiService } from './state/friend/friend.api.service';
import { FriendEffectService } from './state/friend/friend.effect.service';
import { FriendRequestApiService } from './state/friend-request/friend-request.api.service';
import { FriendRequestEffectService } from './state/friend-request/friend-request.effect.service';
import { FriendRequestService } from './state/friend-request/friend-request.service';
import { FriendRequestStateService } from './state/friend-request/friend-request.state.service';
import { FriendService } from './state/friend/friend.service';
import { FriendStateService } from './state/friend/friend.state.service';
import { GameComponent } from './components/game/game.component';
import { GameService } from './services/game/game.service';
import { GunService } from './services/gun/gun.service';
import { HomeComponent } from './components/home/home.component';
import { InactivityService } from './services/inactivity/inactivity.service';
import { JoinGameComponent } from './components/join-game/join-game.component';
import { KeyBindService } from './services/key-bind/key-bind.service';
import { LoginComponent } from './components/login/login.component';
import { MatchMakingService } from './services/match-making/match-making.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PlayerService } from './services/player/player.service';
import { SignupComponent } from './components/signup/signup.component';
import { SocialCellComponent } from './components/social-cell/social-cell.component';
import { SocialChatBoxComponent } from './components/social-chat-box/social-chat-box.component';
import { SocialFriendsListComponent } from './components/social-friends-list/social-friends-list.component';
import { SocialFriendsTabComponent } from './components/social-friends-tab/social-friends-tab.component';
import { SocialFriendRequestsListComponent } from './components/social-friend-requests-list/social-friend-requests-list.component';
import { SocialGroupsListComponent } from './components/social-groups-list/social-groups-list.component';
import { SocialGroupsTabComponent } from './components/social-groups-tab/social-groups-tab.component';
import { SocialRoomsStateService } from './state/social-rooms/social-rooms.state.service';
import { SocialSidenavComponent } from './components/social-sidenav/social-sidenav.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserApiService } from './state/user/user.api.service';
import { UserEffectService } from './state/user/user.effect.service';
import { UserFilterableMultiSelectComponent } from './components/user-filterable-multi-select/user-filterable-multi-select.component';
import { UserService } from './state/user/user.service';
import { UserStateService } from './state/user/user.state.service';

@NgModule({
  declarations: [
    AppComponent,
    BabylonjsComponent,
    BorderDirective,
    CreateGameComponent,
    GameComponent,
    HomeComponent,
    JoinGameComponent,
    LoginComponent,
    NavbarComponent,
    NotFoundComponent,
    SignupComponent,
    SocialCellComponent,
    SocialChatBoxComponent,
    SocialFriendsListComponent,
    SocialFriendsTabComponent,
    SocialFriendRequestsListComponent,
    SocialGroupsListComponent,
    SocialGroupsTabComponent,
    SocialSidenavComponent,
    UserProfileComponent,
    UserFilterableMultiSelectComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    DragDropModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  providers: [
    AuthService,
    AuthFlowService,
    AuthGuardService,
    AuthStateService,
    ColyseusService,
    FpsService,
    FriendApiService,
    FriendEffectService,
    FriendRequestApiService,
    FriendRequestEffectService,
    FriendRequestService,
    FriendRequestStateService,
    FriendService,
    FriendStateService,
    GameService,
    GunService,
    InactivityService,
    KeyBindService,
    MatchMakingService,
    PlayerService,
    SocialRoomsStateService,
    UserApiService,
    UserEffectService,
    UserService,
    UserStateService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
