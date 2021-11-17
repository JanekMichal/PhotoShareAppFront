import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ImageModel} from '../ImageModel';
import {User} from '../user';
import {DataService} from '../_services/data.service';
import {FollowService} from '../_services/follow.service';
import {TokenStorageService} from '../_services/token-storage.service';
import {UserService} from '../_services/user.service';
import {ImageService} from '../_services/image.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  [x: string]: any;

  currentUser: User;

  selectedFile: File;
  retrievedImage: any;
  retrieveResponse: any;
  message: string;
  imageName: any;
  allImagesResponse: ImageModel[];
  selectedImage: any;
  searchedUserData: User;
  searchedUserId: number;


  isCurrentUserFollowingSearchedUser: boolean;
  followersList: User[];
  followingList: User[];
  followersCount: number;
  followingCount: number;

  profilePhoto: ImageModel;

  constructor(private token: TokenStorageService,
              private userService: UserService,
              private http: HttpClient,
              private data: DataService,
              private followService: FollowService,
              private imageService: ImageService) {
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.data.searchedUserId.subscribe(message => this.searchedUserId = message);
    this.getUserData();
    this.isFollowing();
    this.getAllImages();
    this.getFollowers();
    this.getFollowing();
    this.getFollowersCount();
    this.getFollowingCount();


    this.getProfileImage();
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

  onDeleteAccount(): void {
    this.userService.deleteUser(this.searchedUserId).subscribe(
      () => {

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

//  --------------------------------------- FOLLOWERS -----------------------------------------------


  public getFollowers(): void {
    this.followService.getFollowers(this.searchedUserId).subscribe(
      (response: User[]) => {
        this.followersList = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getFollowing(): void {
    this.followService.getFollowing(this.searchedUserId).subscribe(
      (response: User[]) => {
        this.followingList = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  isFollowing(): void {
    this.followService.ifFollowing(this.currentUser.id, this.searchedUserId).subscribe(
      (response: boolean) => {
        if (response === true) {
          this.isCurrentUserFollowingSearchedUser = true;
        } else {
          this.isCurrentUserFollowingSearchedUser = false;
        }
      }
    );
  }

  public onFollow(): void {
    if (this.isCurrentUserFollowingSearchedUser) {
      this.isCurrentUserFollowingSearchedUser = false;
      this.followService.unfollow(this.currentUser.id, this.searchedUserId).subscribe();
    } else {
      this.isCurrentUserFollowingSearchedUser = true;
      this.followService.follow(this.currentUser.id, this.searchedUserId).subscribe();
    }
  }

  public getFollowingCount(): void {
    this.followService.getFollowingCount(this.searchedUserId).subscribe(
      (response: number) => {
        this.followingCount = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getFollowersCount(): void {
    this.followService.getFollowersCount(this.searchedUserId).subscribe(
      (response: number) => {
        this.followersCount = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  // -------------------------------- IMAGES -------------------------------

  public onOpenViewImage(pictureId: number): void {
    this.getImage(pictureId);
  }

  public getAllImages(): void {
    this.imageService.getAllImages(this.searchedUserId).subscribe(
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
    this.imageService.getProfileImage(this.searchedUserId).subscribe(
      (res: ImageModel) => {
        this.profilePhoto = res;
        this.profilePhoto.picByte = 'data:image/jpeg;base64,' + res.picByte;
      }
    );
  }

  // refresh(): void {
  //   window.location.reload();
  // }

  public onDeleteImage(image: ImageModel): void {
    this.imageService.deleteSomeoneImage(image.id).subscribe(
      () => {
        const index = this.allImagesResponse.indexOf(image);
        if (index > -1) {
          this.allImagesResponse.splice(index, 1);
        }
        // this.refresh();
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
}
