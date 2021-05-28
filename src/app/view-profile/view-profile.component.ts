import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { ImageModel } from '../ImageModel';
import { User } from '../user';
import { DataService } from '../_services/data.service';
import { FollowService } from '../_services/follow.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  [x: string]: any;

  currentUser: any;
  currentUserData: User;
  currentUserId: number;

  editUser: User;

  nameForm = '';
  userNameForm = '';
  emailForm = '';

  private server = 'http://localhost:8080';

  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  imageName: any;
  allPhotosResponse: ImageModel[];
  allPhotosData: any = [];
  selectedImage: any;
  searchedUserData: User;
  searchedUserId: number;


  constructor(private token: TokenStorageService,
    private userService: UserService,
    private http: HttpClient,
    private data: DataService,
    private followService: FollowService) { }

  ngOnInit(): void {
    this.currentUserId = this.token.getUser().id;
    this.data.searchedUserId.subscribe(message => this.searchedUserId = message);
    this.getUserData();
    this.isFollowing();
    this.getAllPhotos();
  }

  public getUserData(): void {
    this.userService.getUser(this.searchedUserId).subscribe(
      (response: User) => {
        this.searchedUserData = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  isCurrentUserFollowingSearchedUser: Boolean;

  isFollowing(): void {
    this.followService.ifFollowing(this.currentUserId, this.searchedUserId).subscribe(
      (response: Boolean) => {
        if(response === true) { 
          this.isCurrentUserFollowingSearchedUser = true;
        } else {
          this.isCurrentUserFollowingSearchedUser = false;
        }
      }
    )
  }

  public onFollow(): void {
    if(this.isCurrentUserFollowingSearchedUser) {
      this.isCurrentUserFollowingSearchedUser = false;
      this.followService.unfollow(this.currentUserId, this.searchedUserId).subscribe();
    } else {
      this.isCurrentUserFollowingSearchedUser = true;
      this.followService.follow(this.currentUserId, this.searchedUserId).subscribe();
    }
  }




  //-------------------------------- IMAGES -------------------------------
  public onOpenViewPhoto(pictureId: number) {
    this.getImage(pictureId);
  }

  public getAllPhotos(): void {
    this.http.get<ImageModel[]>(this.server + '/image/get/allphotos/' + this.searchedUserId).subscribe(
      (response: ImageModel[]) => {
        this.allPhotosResponse = response;

        for (let i = 0; i < this.allPhotosResponse.length; i++) {

          this.allPhotosResponse[i].picByte = 'data:image/jpeg;base64,' + this.allPhotosResponse[i].picByte;

        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getImage(imageId: number) {
    //Make a call to Sprinf Boot to get the Image Bytes.
    this.http.get('http://localhost:8080/image/get/' + imageId)
      .subscribe(
        res => {
          this.retrieveResonse = res;
          this.base64Data = this.retrieveResonse.picByte;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
          this.selectedImage = this.retrievedImage;
        }
      );
  }
}
