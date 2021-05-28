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
export class PhotoService {

  allPhotosResponse: ImageModel[];

  constructor(private http: HttpClient) { }

  public getFeedPhotos(userId: number): Observable<ImageModel[]> {
    return this.http.get<ImageModel[]>(API_URL + "get_feed_photos" + userId);
  }
}
