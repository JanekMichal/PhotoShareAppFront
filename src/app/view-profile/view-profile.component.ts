import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ImageModel } from '../ImageModel';
import { User } from '../user';
import { DataService } from '../_services/data.service';
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
  constructor(private userService: UserService, private http: HttpClient, private data: DataService) {}

  ngOnInit(): void {
    this.data.searchedUserId.subscribe(message => this.searchedUserId = message);
    this.getUserData();
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

  public onOpenViewPhoto(pictureId: number) {
    this.getImage(pictureId);
  }

  public getAllPhotos(): void {
    this.http.get<ImageModel[]>(this.server + '/image/get/allphotos/' + this.searchedUserId).subscribe(
      (response: ImageModel[]) => {
        this.allPhotosResponse = response;

        for (let i = 0; i < this.allPhotosResponse.length; i++) {
          console.log(this.allPhotosResponse[i].picByte)
          this.allPhotosResponse[i].picByte = 'data:image/jpeg;base64,' + this.allPhotosResponse[i].picByte;
          console.log(this.allPhotosResponse[i].picByte)
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
