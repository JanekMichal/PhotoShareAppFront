import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../user';
import {TokenStorageService} from './token-storage.service';

const API_URL = 'http://localhost:8080/user/';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: any;
  currentUserId: number;

  constructor(private http: HttpClient, private token: TokenStorageService) {
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', {responseType: 'text'});
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(API_URL + 'admin');
  }

  getUsersPage(pageNumber: number): Observable<User[]> {
    return this.http.get<User[]>(API_URL + 'page_users/' + pageNumber);
  }

  getCurrentUser(): Observable<User> {
    this.currentUser = this.token.getUser();
    this.currentUserId = this.currentUser.id;
    return this.http.get<User>(API_URL + 'profile/' + this.currentUserId);
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(API_URL + 'profile/' + userId);
  }

  searchForUser(name: string): Observable<User[]> {
    return this.http.get<User[]>(API_URL + 'search/' + name);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(API_URL + 'delete_user/' + userId);
  }

  changePassword(userId: number, newPassword: string): Observable<any> {
    return this.http.patch<any>(API_URL + 'change_user_password/' + userId, {
      password: newPassword
    }, httpOptions
    );
  }

  updateUserData(user: User): Observable<any> {
    return this.http.patch<any>(API_URL + 'update_user_data/' + user.id, {
        username: user.username,
        email: user.email,
        name: user.name
      }, httpOptions
    );
  }

  editName(user: User, editUserNameStr: string): Observable<User> {
    return this.http.patch<User>(API_URL + 'profile/' + user.id + '/' + editUserNameStr, user);
  }

  editUserName(user: User, editUserNameStr: string): Observable<User> {
    return this.http.patch<User>(API_URL + 'profile/' + user.id + '/username/' + editUserNameStr, user);
  }

  editEmail(user: User, editEmailStr: string): Observable<User> {
    return this.http.patch<User>(API_URL + 'profile/' + user.id + '/email/' + editEmailStr, user);
  }
}
