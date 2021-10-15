import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageModel } from '../ImageModel';
import { CommentModel } from '../CommentModel';
const API_URL = 'http://localhost:8080/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient) { }

  
  public addComment(userId: number, photoId: number, description: String): Observable<any> {
    return this.http.post<String>(
      API_URL + "comment/add_comment/" + photoId + "/" + userId, description);
  }

  public deleteComment(commentId: number): Observable<any> {
    return this.http.delete<any>(API_URL + "comment/delete_comment/" + commentId);
  }

  public getCommentsCount(imageId: number): Observable<number> {
    return this.http.get<number>(API_URL + "comment/comments_count/" + imageId);
  }

  public getComments(photoId: number): Observable<CommentModel[]> {
    return this.http.get<CommentModel[]>(API_URL + "comment/get_comments/" + photoId);
  }

  public getCommentsPaged(photoId: number, pageNumber: number): Observable<CommentModel[]> {
    return this.http.get<CommentModel[]>(
      API_URL + "comment/get_comments_paged/" + photoId + "/" + pageNumber);
  }

  public getFeedPhotos(userId: number): Observable<ImageModel[]> {
    return this.http.get<ImageModel[]>(API_URL + "image/get_feed_photos/" + userId);
  }

  public changeDescription(imageId: number, description: String): Observable<ImageModel> {
    console.log(imageId, description)
    return this.http.patch<ImageModel>(API_URL + "image/change_description/" + imageId, description);
  }
}
