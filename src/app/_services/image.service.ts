import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageModel } from '../ImageModel';

const API_URL = 'http://localhost:8080/api/';

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
    return this.http.get<ImageModel[]>(API_URL + "get_feed_photos" + userId);
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
