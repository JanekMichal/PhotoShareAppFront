import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../user';

const API_URL = 'http://localhost:8080/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private http: HttpClient) {}

  getFollowers(followerId: number): Observable<User[]> {
    return this.http.get<User[]>(API_URL + 'get_followers/' + followerId);
  }

  getFollowingCount(followerId: number): Observable<number> {
    return this.http.get<number>(API_URL + 'get_following_count/' + followerId);
  }

  follow(followerId: number, followedId: number): Observable<any> {
    return this.http.post(API_URL + 'follow_user', {
      followerId: followerId,
      followedId: followedId 
    }, httpOptions );
  }

  unfollow(followerId: number, followedId: number): Observable<any> {
    return this.http.delete(API_URL + followerId + '/unfollow_user/' + + followedId);
  }

  ifFollowing(followerId: number, followedId: number): Observable<Boolean> {
    return this.http.get<Boolean>(API_URL + followerId + '/is_following/' + followedId);
  }
}


