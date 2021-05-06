import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from './user';
import { TokenStorageService } from './_services/token-storage.service';
import { UserService } from './_services/user.service';
import { Input } from '@angular/core'
import { DataService } from './_services/data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  name: string;
  email: string;

  searchName: string;

  constructor(private tokenStorageService: TokenStorageService, private data: DataService) { }

  ngOnInit(): void {
    // this.data.currentMessage.subscribe(message => this.searchName = message);
    // console.log(this.searchName);
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.email = user.email;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
      
      this.name = user.name;
      this.username = user.username;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  public onSearchUser() {
    this.data.changeMessage(this.searchName);
  }


}
