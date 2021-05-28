import { Component, OnInit } from '@angular/core';
import { ImageModel } from '../ImageModel';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';
import { PhotoService } from '../_services/photo.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../user';

const API_URL = 'http://localhost:8080/image/';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})

export class BoardUserComponent implements OnInit {

  allPhotosResponse: ImageModel[];
  currentUser: any;
  currentUserId: number;

  constructor(private userService: UserService,
    private token: TokenStorageService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.currentUserId = this.currentUser.id;
    this.getFeedPhotos();
  }

  public getFeedPhotos(): void {
    this.http.get<ImageModel[]>(API_URL + "get_feed_photos/" + this.currentUserId).subscribe(
      (response: ImageModel[]) => {
        this.allPhotosResponse = response;
        for (let i = 0; i < this.allPhotosResponse.length; i++) {
          this.allPhotosResponse[i].picByte = 'data:image/jpeg;base64,' + this.allPhotosResponse[i].picByte;
          this.userService.getUser(this.allPhotosResponse[i].ownerId).subscribe(
            (response: User) => {
              this.allPhotosResponse[i].name = response.username;
            }
          );

        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
}
