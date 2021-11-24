import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {User} from '../user';
import {UserService} from '../_services/user.service';
import {DataService} from '../_services/data.service';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  content: string;
  users: User[];
  editUser: User;
  deleteUser: User;

  nameForm = '';
  userNameForm = '';
  emailForm = '';

  pageNumber = 0;

  sortedById = false;
  sortedByEmail = false;
  sortedByRole = false;
  sortedByUsername = false;

  constructor(private data: DataService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.getUsersPage();
  }

  public getUsers(): void {
    this.userService.getUsers().subscribe(
      (response: User[]) => {
        this.users = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getUsersPage(): void {
    this.setAllSortFlagsToFalse();
    this.userService.getUsersPage(this.pageNumber).subscribe(
      (response: User[]) => {
        if (this.pageNumber === 0) {
          this.users = response;
        } else {
          this.users = this.users.concat(response);
        }
        this.pageNumber++;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public setAllSortFlagsToFalse(): void {
    this.sortedById = false;
    this.sortedByUsername = false;
    this.sortedByRole = false;
    this.sortedByEmail = false;
  }

  public sortUsersByUsernameASC(): void {
    this.setAllSortFlagsToFalse();
    this.sortedByUsername = true;
    this.users.sort((index1, index2) => {
      if (index1.username > index2.username) {
        return 1;
      } else if (index1.username < index2.username) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  onViewUserProfile(id: number): void {
    this.data.setSearchedUserId(id);
  }
  public sortUsersByUsernameDESC(): void {
    this.setAllSortFlagsToFalse();
    this.users.sort((index1, index2) => {
      if (index1.username < index2.username) {
        return 1;
      } else if (index1.username > index2.username) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  public sortUsersByIdASC(): void {
    this.setAllSortFlagsToFalse();
    this.sortedById = true;
    this.users.sort((index1, index2) => {
      if (index1.id > index2.id) {
        return 1;
      } else if (index1.id < index2.id) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  public sortUsersByIdDESC(): void {
    this.setAllSortFlagsToFalse();
    this.users.sort((index1, index2) => {
      if (index1.id < index2.id) {
        return 1;
      } else if (index1.id > index2.id) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  sortUsersByEmailASC(): void {
    this.setAllSortFlagsToFalse();
    this.sortedByEmail = true;
    this.users.sort((index1, index2) => {
      if (index1.email > index2.email) {
        return 1;
      } else if (index1.email < index2.email) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  sortUsersByEmailDESC(): void {
    this.setAllSortFlagsToFalse();
    this.users.sort((index1, index2) => {
      if (index1.email < index2.email) {
        return 1;
      } else if (index1.email > index2.email) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  sortUsersByRoleASC(): void {
    this.setAllSortFlagsToFalse();
    this.sortedByRole = true;
    this.users.sort((index1, index2) => {
      if (index1.role > index2.role) {
        return 1;
      } else if (index1.role < index2.role) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  sortUsersByRoleDESC(): void {
    this.setAllSortFlagsToFalse();
    this.users.sort((index1, index2) => {
      if (index1.role < index2.role) {
        return 1;
      } else if (index1.role > index2.role) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  public onDeleteUser(userId: number): void {
    this.userService.deleteSomeoneElseAccount(userId).subscribe(
      (response: void) => {
        console.log(response);
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onOpenModal(user: User, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');
    if (mode === 'edit') {
      this.editUser = user;
      this.nameForm = this.editUser.name;
      this.emailForm = this.editUser.email;
      this.userNameForm = this.editUser.username;
      button.setAttribute('data-bs-target', '#editUserModal');
    }
    if (mode === 'delete') {
      this.deleteUser = user;
      button.setAttribute('data-bs-target', '#deleteUserModal');
    }
    container.appendChild(button);
    button.click();
  }

  onEditUserData(user: User): void {
    this.userService.editName(user, this.nameForm).subscribe(
      (response: User) => {
        console.log(response);
        this.nameForm = '';
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

    this.userService.editUserName(user, this.userNameForm).subscribe(
      (response: User) => {
        console.log(response);
        this.userNameForm = '';
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

    this.userService.editEmail(user, this.emailForm).subscribe(
      (response: User) => {
        console.log(response);
        this.emailForm = '';
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


}
