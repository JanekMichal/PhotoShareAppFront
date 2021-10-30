import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ImageModel} from '../ImageModel';
import {CommentModel} from '../CommentModel';

const API_URL = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient) {
  }


  public addComment(userId: number, imageId: number, description: string): Observable<any> {
    return this.http.post<string>(API_URL + 'comment/add_comment/' + imageId + '/' + userId, description);
  }

  public deleteComment(commentId: number): Observable<any> {
    return this.http.delete<any>(API_URL + 'comment/delete_comment/' + commentId);
  }

  public getCommentsCount(imageId: number): Observable<number> {
    return this.http.get<number>(API_URL + 'comment/comments_count/' + imageId);
  }

  public getComments(imageId: number): Observable<CommentModel[]> {
    return this.http.get<CommentModel[]>(API_URL + 'comment/get_comments/' + imageId);
  }

  public getCommentsPaged(imageId: number, pageNumber: number): Observable<CommentModel[]> {
    return this.http.get<CommentModel[]>(
      API_URL + 'comment/get_comments_paged/' + imageId + '/' + pageNumber);
  }

  public getFeedImages(userId: number): Observable<ImageModel[]> {
    return this.http.get<ImageModel[]>(API_URL + 'image/get_feed_images/' + userId);
  }

  public changeDescription(imageId: number, description: string): Observable<ImageModel> {
    return this.http.patch<ImageModel>(API_URL + 'image/change_description/' + imageId, description);
  }

  public uploadImage(userId: number, uploadImageData: FormData): Observable<any> {
    return this.http.post(API_URL + 'image/upload_image/' + userId, uploadImageData);
  }

  public uploadProfileImage(userId: number, uploadImageData: FormData): Observable<any> {
    return this.http.post(API_URL + 'image/upload_profile_image/' + userId, uploadImageData);
  }

  public getProfilePhoto(userId: number): Observable<ImageModel> {
    return this.http.get<ImageModel>(API_URL + 'image/get_profile_image/' + userId);
  }

  public getAllImages(userId: number): Observable<ImageModel[]> {
    return this.http.get<ImageModel[]>(API_URL + 'image/get/all_images/' + userId);
  }

  public deleteImage(imageId: number): Observable<any> {
    return this.http.delete<void>(API_URL + 'image/delete/' + imageId);
  }

  public getImage(imageId: number): Observable<ImageModel> {
    return this.http.get<ImageModel>(API_URL + 'image/get/' + imageId);
  }
}
