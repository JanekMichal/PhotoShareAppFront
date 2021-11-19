import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ImageModel} from '../ImageModel';

const API_URL = 'http://localhost:8080/image/';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient) {
  }

  public getFeedImages(): Observable<ImageModel[]> {
    return this.http.get<ImageModel[]>(API_URL + 'get_feed_images');
  }

  public changeDescription(imageId: number, description: string): Observable<ImageModel> {
    return this.http.patch<ImageModel>(API_URL + 'change_description/' + imageId, description);
  }

  public uploadImage(uploadImageData: FormData): Observable<any> {
    return this.http.post(API_URL + 'upload_image', uploadImageData);
  }

  public uploadProfileImage(uploadImageData: FormData): Observable<ImageModel> {
    return this.http.post<ImageModel>(API_URL + 'upload_profile_image', uploadImageData);
  }

  public getProfileImage(userId: number): Observable<ImageModel> {
    return this.http.get<ImageModel>(API_URL + 'get_profile_image/' + userId);
  }

  public getAllImages(userId: number): Observable<ImageModel[]> {
    return this.http.get<ImageModel[]>(API_URL + 'get/all_images/' + userId);
  }

  public deleteOwnImage(imageId: number): Observable<any> {
    return this.http.delete<void>(API_URL + 'delete_own_image/' + imageId);
  }

  public deleteSomeoneImage(imageId: number): Observable<any> {
    return this.http.delete<void>(API_URL + 'delete_someone_image/' + imageId);
  }

  public getImage(imageId: number): Observable<ImageModel> {
    return this.http.get<ImageModel>(API_URL + 'get/' + imageId);
  }
}
