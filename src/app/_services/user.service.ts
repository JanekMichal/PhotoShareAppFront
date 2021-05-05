import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../user';
import { TokenStorageService } from './token-storage.service';

const API_URL = 'http://localhost:8080/api/test/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: any;
  currentUserId: number;

  constructor(private http: HttpClient, private token: TokenStorageService) { }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(API_URL + 'admin');
  }

  //zmienić na getId() (może??)
  getCurrentUser(): Observable<User> {
    this.currentUser = this.token.getUser();
    this.currentUserId = this.currentUser.id;
    return this.http.get<User>(API_URL + 'profile/' + this.currentUserId);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(API_URL + 'admin/delete/id/' + userId);
  }

  //nie wiem czy ma sens 
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(API_URL + 'profile/edit-name', user);
  }

  editName(user: User, editUserNameStr: String): Observable<User> {
    return this.http.patch<User>(API_URL + 'profile/' + user.id + "/" + editUserNameStr, user)
  }

  editUserName(user: User, editUserNameStr: String): Observable<User> {
    return this.http.patch<User>(API_URL + 'profile/' + user.id + "/username/" + editUserNameStr, user)
  }

  editEmail(user: User, editEmailStr: String): Observable<User> {
    return this.http.patch<User>(API_URL + 'profile/' + user.id + "/email/" + editEmailStr, user)
  }
  
}
