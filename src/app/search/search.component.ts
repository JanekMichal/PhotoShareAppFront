import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {User} from '../user';
import {UserService} from '../_services/user.service';
import {DataService} from '../_services/data.service';
import {TokenStorageService} from '../_services/token-storage.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchedUsers: User[];
  currentUser: User;

  constructor(private userService: UserService,
              private data: DataService,
              private token: TokenStorageService) {
  }

  searchName: string;

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message => this.searchName = message);
    this.currentUser = this.token.getUser();
    if (this.searchName !== '') {
      this.onSearchForUser();
    }
  }

  onSearchForUser(): void {
    this.userService.searchForUser(this.searchName).subscribe(
      (response: User[]) => {
        this.searchedUsers = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onViewUserProfile(id: number): void {
    this.data.setSearchedUserId(id);
  }
}
