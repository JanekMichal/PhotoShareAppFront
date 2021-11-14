import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

const API_URL = 'http://localhost:8080/like/';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  constructor(private http: HttpClient) {
  }

  public addLike(imageId: number): Observable<any> {
    return this.http.post(API_URL + 'add_like', {
      imageId
    }, httpOptions);
  }

  public getLikesCount(imageId: number): Observable<number> {
    return this.http.get<number>(API_URL + 'likes_count/' + imageId);
  }

  public isUserLikingThisPhoto(imageId: number): Observable<boolean> {
    return this.http.get<boolean>(API_URL + 'is_liking_this_image/' + imageId);
  }
}
