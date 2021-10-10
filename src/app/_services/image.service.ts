import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageModel } from '../ImageModel';
import { CommentModel } from '../CommentModel';
const API_URL = 'http://localhost:8080/image/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class ImageService {

  allPhotosResponse: ImageModel[];

  constructor(private http: HttpClient) { }

  public getFeedPhotos(userId: number): Observable<ImageModel[]> {
    return this.http.get<ImageModel[]>("http://localhost:8080/image/get_feed_photos/" + userId);
  }

  public addComment(userId: number, photoId: number, description: String): Observable<any> {
    return this.http.post<String>("http://localhost:8080/image/add_comment/" + photoId + "/" + userId, description);
  }

  public deleteComment(commentId: number): Observable<any> {
    return this.http.delete<any>(API_URL + "delete_comment/" + commentId);
  }

  public getCommentsCount(imageId: number): Observable<number> {
    return this.http.get<number>(API_URL + "comments_count/" + imageId);
  }

  public getComments(photoId: number): Observable<CommentModel[]> {
    return this.http.get<CommentModel[]>("http://localhost:8080/image/get_comments/" + photoId);
  }
  //to drugie description nie jest potrzebne...
  public changeDescription(imageId: number, description: String): Observable<ImageModel> {
    console.log(imageId, description)
    return this.http.patch<ImageModel>("http://localhost:8080/image/change_description/" + imageId, description);
  }

  

  // editEmail(user: User, editEmailStr: String): Observable<User> {
  //   return this.http.patch<User>(API_URL + 'profile/' + user.id + "/email/" + editEmailStr, user)
  // }
}
