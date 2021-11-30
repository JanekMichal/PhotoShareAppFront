import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile/profile.component';
import {BoardUserComponent} from './board-user/board-user.component';
import {BoardModeratorComponent} from './board-moderator/board-moderator.component';
import {BoardAdminComponent} from './board-admin/board-admin.component';
import {SearchComponent} from './search/search.component';
import {ViewProfileComponent} from './view-profile/view-profile.component';
import {ProfileEditorComponent} from './profile-editor/profile-editor.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'user', component: BoardUserComponent},
  {path: 'mod', component: BoardModeratorComponent},
  {path: 'admin', component: BoardAdminComponent},
  {path: 'admin/view-profile', component: ViewProfileComponent},
  {path: 'search', component: SearchComponent},
  {path: 'search/view-profile', component: ViewProfileComponent},
  {path: 'search/view-profile/board-admin', component: BoardAdminComponent},
  {path: 'search/profile', component: ProfileComponent},
  {path: 'user/view-profile', component: ViewProfileComponent},
  {path: 'profile/profile-editor', component: ProfileEditorComponent},
  {path: 'profile/view-profile', component: ViewProfileComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
