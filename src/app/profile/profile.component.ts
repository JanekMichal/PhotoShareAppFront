import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ImageModel} from '../ImageModel';
import {User} from '../user';
import {TokenStorageService} from '../_services/token-storage.service';
import {UserService} from '../_services/user.service';
import {FollowService} from '../_services/follow.service';
import {ImageService} from '../_services/image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  [x: string]: any;

  message: string;

  // -------------- User --------------
  currentUser: any;
  currentUserId: number;
  currentUserData: User;

  editUser: User;


  // -------------- FOLLOW --------------
  followingCount: number;
  followersCount: number;
  followersList: User[];
  followingList: User[];

  // -------------- IMAGES --------------
  descriptionFormTextArea = '';
  selectedFile: File;
  retrievedImage: any;
  retrieveResponse: any;
  profilePhoto: ImageModel;
  imageName: any;
  allImagesResponse: ImageModel[];
  selectedImage: any;
  selectedDeleteImage: ImageModel;
  currentImageId: number;

  acceptableFileTypes = ['image/jpeg', 'image.png'];
  isImageValid = false;
  maxImageSize = 5242880; // 5MB

  constructor(private token: TokenStorageService,
              private userService: UserService,
              private http: HttpClient,
              private followService: FollowService,
              private imageService: ImageService
  ) {
  }

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

  //  --------------------------------------- FOLLOWERS -----------------------------------------------
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

  public onChangeDescription(): void {
    this.imageService.changeDescription(this.currentImageId, this.descriptionFormTextArea).subscribe();
    this.refresh();
  }


  onOpenDescriptionModal(description: string, imageId: number): void {
    this.currentImageId = imageId;
    this.descriptionFormTextArea = description;
  }

  public createFileUploadErrorChild(message: string): HTMLParagraphElement {
    const fileStatusParagraph = document.createElement('p');
    fileStatusParagraph.textContent = message;
    fileStatusParagraph.style.color = 'red';
    fileStatusParagraph.style.marginTop = '1rem';
    return fileStatusParagraph;
  }

  public onFileChanged(event): void {
    this.selectedFile = event.target.files[0];
    const preview = document.querySelector('#selectedFileStatus');
    while (preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }

    if (this.selectedFile !== null) {
      this.isImageValid = true;
      if (!this.acceptableFileTypes.includes(this.selectedFile.type)) {
        preview.appendChild(this.createFileUploadErrorChild('Wrong file type. Only JPG, JPEG and PNG files are accepted.'));
        this.isImageValid = false;
      }

      if (this.selectedFile.size > this.maxImageSize) {
        preview.appendChild(this.createFileUploadErrorChild('Image is too big. Maximum size is 5MB.'));
        this.isImageValid = false;
      }
    }
  }

  public onOpenViewImage(pictureId: number): void {
    this.getImage(pictureId);
  }

  public onDeleteImage(): void {
    this.imageService.deleteOwnImage(this.selectedDeleteImage.id).subscribe(
      () => {
        const index = this.allImagesResponse.indexOf(this.selectedDeleteImage);
        if (index > -1) {
          this.allImagesResponse.splice(index, 1);
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  onUpload(): void {
    if (this.isImageValid) {
      const uploadImageData = new FormData();
      uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);

      this.imageService.uploadImage(uploadImageData).subscribe(
        (response: ImageModel) => {
          response.picByte = 'data:image/jpeg;base64,' + response.picByte;
          this.allImagesResponse.unshift(response);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  public getAllImages(): void {
    this.imageService.getAllImages(this.currentUser.id).subscribe(
      (response: ImageModel[]) => {
        this.allImagesResponse = response;
        this.allImagesResponse.forEach(item => {
          item.picByte = 'data:image/jpeg;base64,' + item.picByte;
        });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getProfileImage(): void {
    this.imageService.getProfileImage(this.currentUser.id).subscribe(
      (res: ImageModel) => {
        if (res != null) {
          this.profilePhoto = res;
          this.profilePhoto.picByte = 'data:image/jpeg;base64,' + this.profilePhoto.picByte;
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getImage(imageId: number): void {
    this.imageService.getImage(imageId).subscribe(
      res => {
        this.retrieveResponse = res;
        this.retrievedImage = 'data:image/jpeg;base64,' + res.picByte;
        this.selectedImage = this.retrievedImage;
      }
    );
  }

  public onOpenDeleteModal(image: ImageModel): void {
    this.selectedDeleteImage = image;
  }
}
