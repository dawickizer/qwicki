import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
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
import { AuthApiService } from './state/auth/auth.api.service';
import { AuthGuardService } from './state/auth/auth.guard.service';
import { AuthInterceptor } from './state/auth/auth.interceptor.service';
import { AuthOrchestratorService } from './state/orchestrator/auth.orchestrator.service';
import { AuthService } from './state/auth/auth.service';
import { AuthStateService } from './state/auth/auth.state.service';
import { BabylonjsComponent } from './components/game/babylonjs/babylonjs.component';
import { BorderDirective } from './directives/border.directive';
import { ChatBoxComponent } from './components/social/chat-box/chat-box.component';
import { ChatCellComponent } from './components/social/chat-cell/chat-cell.component';
import { ColyseusService } from './services/colyseus/colyseus.service';
import { CreateGameComponent } from './components/match-making/create-game/create-game.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FpsService } from './services/fps/fps.service';
import { FriendApiService } from './state/friend/friend.api.service';
import { FriendEffectService } from './state/friend/friend.effect.service';
import { FriendRequestApiService } from './state/friend-request/friend-request.api.service';
import { FriendRequestEffectService } from './state/friend-request/friend-request.effect.service';
import { FriendRequestService } from './state/friend-request/friend-request.service';
import { FriendRequestStateService } from './state/friend-request/friend-request.state.service';
import { FriendService } from './state/friend/friend.service';
import { FriendsListComponent } from './components/social/friends-list/friends-list.component';
import { FriendsTabComponent } from './components/social/friends-tab/friends-tab.component';
import { FriendStateService } from './state/friend/friend.state.service';
import { GameComponent } from './components/game/game/game.component';
import { GameService } from './services/game/game.service';
import { GroupsListComponent } from './components/social/groups-list/groups-list.component';
import { GroupsTabComponent } from './components/social/groups-tab/groups-tab.component';
import { GunService } from './services/gun/gun.service';
import { HomeComponent } from './components/home/home.component';
import { InboundFriendRequestsComponent } from './components/social/inbound-friend-requests/inbound-friend-requests.component';
import { InactivityService } from './services/inactivity/inactivity.service';
import { InboxEffectService } from './state/inbox/inbox.effect.service';
import { InboxService } from './state/inbox/inbox.service';
import { InboxStateService } from './state/inbox/inbox.state.service';
import { IsTypingComponent } from './components/misc/is-typing/is-typing.component';
import { JoinGameComponent } from './components/match-making/join-game/join-game.component';
import { KeyBindService } from './services/key-bind/key-bind.service';
import { LobbyComponent } from './components/match-making/lobby/lobby.component';
import { LoginComponent } from './components/auth/login/login.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { MatchMakingService } from './services/match-making/match-making.service';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NotificationBadgeComponent } from './components/misc/notification-badge/notification-badge.component';
import { OutboundFriendRequestsComponent } from './components/social/outbound-friend-requests/outbound-friend-requests.component';
import { PlayerService } from './services/player/player.service';
import { SignupComponent } from './components/auth/signup/signup.component';
import { SocialOrchestratorService } from './state/orchestrator/social.orchestrator.service';
import { SocialSidenavComponent } from './components/social/social-sidenav/social-sidenav.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { UserApiService } from './state/user/user.api.service';
import { UserEffectService } from './state/user/user.effect.service';
import { UserFilterableMultiSelectComponent } from './components/misc/user-filterable-multi-select/user-filterable-multi-select.component';
import { UserService } from './state/user/user.service';
import { UserStateService } from './state/user/user.state.service';

@NgModule({
  declarations: [
    AppComponent,
    BabylonjsComponent,
    BorderDirective,
    ChatBoxComponent,
    ChatCellComponent,
    CreateGameComponent,
    DashboardComponent,
    FriendsListComponent,
    FriendsTabComponent,
    GameComponent,
    GroupsListComponent,
    GroupsTabComponent,
    HomeComponent,
    InboundFriendRequestsComponent,
    IsTypingComponent,
    JoinGameComponent,
    LobbyComponent,
    LoginComponent,
    MainLayoutComponent,
    NavbarComponent,
    NotFoundComponent,
    NotificationBadgeComponent,
    OutboundFriendRequestsComponent,
    SignupComponent,
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
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
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
    AuthApiService,
    AuthGuardService,
    AuthOrchestratorService,
    AuthService,
    AuthStateService,
    ColyseusService,
    InboxEffectService,
    InboxService,
    InboxStateService,
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
    SocialOrchestratorService,
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
