import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ImageModel } from '../ImageModel';
import { User } from '../user';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';
import { FollowService } from '../_services/follow.service';
import { ImageService } from '../_services/image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  [x: string]: any;
  //-------------- User --------------
  currentUser: any;
  currentUserData: User;
  currentUserId: number;

  editUser: User;

  nameForm = '';
  userNameForm = '';
  emailForm = '';

  //-------------- FOLLOW --------------

  followingCount: number;
  followersCount: number;


  //-------------- IMAGES --------------

  descriptionFormTextArea = '';
  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  imageName: any;
  allImagesResponse: ImageModel[];
  allImagesData: any = [];
  profilePhoto: ImageModel;
  selectedImage: any;



  constructor(private token: TokenStorageService,
    private userService: UserService,
    private http: HttpClient,
    private followService: FollowService,
    private imageService: ImageService
  ) { }

  public getCurrentUserF(): void {
    this.userService.getCurrentUser().subscribe(
      (response: User) => {
        this.currentUserData = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.currentUserId = this.currentUser.id;
    this.getCurrentUserF();
    this.getAllImages();
    this.getProfileImage();
    this.getFollowingCount();
    this.getFollowersCount();
    this.getFollowers();
    this.getFollowing();
  }

  refresh(): void {
    window.location.reload();
  }
  //  --------------------------------------- USER DATA -----------------------------------------------

  onOpenModal(user: User, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');
    if (mode === 'edit') {
      this.editUser = this.currentUserData;
      this.nameForm = this.editUser.name;
      this.emailForm = this.editUser.email;
      this.userNameForm = this.editUser.username;
      button.setAttribute('data-bs-target', '#editUserModal');
    }
    if (mode === 'delete') {
      this.deleteUser = user;
      button.setAttribute('data-bs-target', '#deleteUserModal');
    }
    container.appendChild(button);
    button.click();
  }

  onEditUserData(user: User): void {
    this.userService.editName(user, this.nameForm).subscribe(
      (response: User) => {
        this.nameForm = '';
        this.refresh();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

    this.userService.editUserName(user, this.userNameForm).subscribe(
      (response: User) => {
        this.userNameForm = '';
        this.reloadPage();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

    this.userService.editEmail(user, this.emailForm).subscribe(
      (response: User) => {
        this.emailForm = '';
        this.reloadPage();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  //  --------------------------------------- FOLLOWERS -----------------------------------------------

  followersList: User[];
  followingList: User[];

  public getFollowers(): void {
    this.followService.getFollowers(this.currentUserId).subscribe(
      (response: User[]) => {
        this.followersList = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getFollowing(): void {
    this.followService.getFollowing(this.currentUserId).subscribe(
      (response: User[]) => {
        this.followingList = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onUnfollow(removedUserId: number): void {
    this.followService.unfollow(this.currentUserId, removedUserId).subscribe();
    this.getFollowing();
  }

  public onRemove(removedUserId: number): void {
    this.followService.unfollow(removedUserId, this.currentUserId).subscribe();
  }

  public getFollowingCount(): void {
    this.followService.getFollowingCount(this.currentUser.id).subscribe(
      (response: number) => {
        this.followingCount = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getFollowersCount(): void {
    this.followService.getFollowersCount(this.currentUser.id).subscribe(
      (response: number) => {
        this.followersCount = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  //  --------------------------------------- IMAGES -----------------------------------------------

  public onChangeDescription() {
    console.log(this.currentImageId, this.descriptionFormTextArea);
    this.imageService.changeDescription(this.currentImageId, this.descriptionFormTextArea).subscribe();
    this.refresh();
  }

  currentImageId: number;
  onOpenDescriptionModal(description: string, imageId: number): void {
    this.currentImageId = imageId;
    this.descriptionFormTextArea = description;

  }

  public onFileChanged(event) {
    //Select File
    this.selectedFile = event.target.files[0];
  }

  public onOpenViewImage(pictureId: number) {
    this.getImage(pictureId);
  }

  public onDeleteImage(imageId: number) {
    this.imageService.deleteImage(imageId).subscribe(
      (response: void) => {
        console.log(response);
        this.refresh();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  onUpload() {
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);
   
    this.imageService.uploadImage(this.currentUser.id, uploadImageData).subscribe(
      (response) => {
        console.log(response);
        this.refresh();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getAllImages(): void {
    this.imageService.getAllImages(this.currentUser.id).subscribe(
      (response: ImageModel[]) => {
        this.allImagesResponse = response;
        for (let i = 0; i < this.allImagesResponse.length; i++) {
          this.allImagesResponse[i].picByte = 'data:image/jpeg;base64,' + this.allImagesResponse[i].picByte;
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getProfileImage() {
    console.log(this.currentUser.id)
    this.imageService.getProfilePhoto(this.currentUser.id).subscribe(
        (res: ImageModel) => {
          this.profilePhoto = res;
          this.profilePhoto.picByte = 'data:image/jpeg;base64,' + res.picByte;
          // this.retrieveResonse = res;
          // this.base64Data = this.retrieveResonse.picByte;
          // this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
          // this.selectedImage = this.retrievedImage;
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
