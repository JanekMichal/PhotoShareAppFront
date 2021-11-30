import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CommentModel} from '../CommentModel';
import {HttpClient} from '@angular/common/http';
import {Comment} from '@angular/compiler';

const API_URL = 'http://localhost:8080/comment/';

@Injectable({
  providedIn: 'root'
})

export class CommentService {

  constructor(private http: HttpClient) {
  }

  public addComment(userId: number, imageId: number, description: string): Observable<CommentModel> {
    return this.http.post<CommentModel>(API_URL + 'add_comment/' + imageId, description);
  }

  public deleteComment(commentId: number): Observable<any> {
    return this.http.delete<any>(API_URL + 'delete_comment/' + commentId);
  }

  public getCommentsCount(imageId: number): Observable<number> {
    return this.http.get<number>(API_URL + 'comments_count/' + imageId);
  }

  public getComments(imageId: number): Observable<CommentModel[]> {
    return this.http.get<CommentModel[]>(API_URL + 'get_comments/' + imageId);
  }

  public getCommentsPaged(imageId: number, pageNumber: number): Observable<CommentModel[]> {
    return this.http.get<CommentModel[]>(
      API_URL + 'get_comments_paged/' + imageId + '/' + pageNumber);
  }
}
