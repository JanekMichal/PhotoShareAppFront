import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../_services/user.service';
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

  pageNumber: number = 0;

  constructor(private userService: UserService) { }

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
    this.userService.getUsersPage(this.pageNumber).subscribe(
      (response: User[]) => {
        if(this.pageNumber == 0) { 
          this.users = response;
        } else {
          this.users = this.users.concat(response);
        }
        this.pageNumber++;
        // for (let i = 0; i < response.length; i++) {
        //   this.users[i] = response[i];
        //   console.log(response[i])
        // }
         
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getUsersPage2(): void {
    this.userService.getUsersPage(1).subscribe(
      (response: User[]) => {
        if(this.pageNumber == 0) {
          this.pageNumber++;
          this.users = response;
        } else {
          this.users = this.users.concat(response);
        }
        // for (let i = 0; i < response.length; i++) {
        //   this.users[i] = response[i];
        //   console.log(response[i])
        // }
         
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }



  public onDeleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe(
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
