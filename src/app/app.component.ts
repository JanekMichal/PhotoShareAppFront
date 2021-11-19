import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from './_services/token-storage.service';
import {DataService} from './_services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private role: string;
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  name: string;
  email: string;
  id: number;

  searchName: string;
  title: string;

  constructor(private tokenStorageService: TokenStorageService, private data: DataService) {
  }

  ngOnInit(): void {
    // this.data.currentMessage.subscribe(message => this.searchName = message);
    // console.log(this.searchName);
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.role = user.role;
      this.email = user.email;
      this.id = user.id;
      this.showAdminBoard = this.role === 'ADMIN';
      this.showModeratorBoard = this.role === 'MODERATOR';

      this.name = user.name;
      this.username = user.username;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  public onSearchUser(): void {
    this.data.changeMessage(this.searchName);
  }
}
