import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ImageModel} from '../ImageModel';
import {User} from '../user';
import {DataService} from '../_services/data.service';
import {FollowService} from '../_services/follow.service';
import {TokenStorageService} from '../_services/token-storage.service';
import {UserService} from '../_services/user.service';

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
  retrieveResponse: any;
  message: string;
  imageName: any;
  allPhotosResponse: ImageModel[];
  allPhotosData: any = [];
  selectedImage: any;
  searchedUserData: User;
  searchedUserId: number;

  isCurrentUserFollowingSearchedUser: boolean;
  followersList: User[];
  followingList: User[];

  constructor(private token: TokenStorageService,
              private userService: UserService,
              private http: HttpClient,
              private data: DataService,
              private followService: FollowService) {
  }

  ngOnInit(): void {
    this.currentUserId = this.token.getUser().id;
    this.data.searchedUserId.subscribe(message => this.searchedUserId = message);
    this.getUserData();
    this.isFollowing();
    this.getAllPhotos();
    this.getFollowers();
    this.getFollowing();
    this.getFollowersCount();
    this.getFollowingCount();

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

//  --------------------------------------- FOLLOWERS -----------------------------------------------


  public getFollowers(): void {
    this.followService.getFollowers(this.searchedUserId).subscribe(
      (response: User[]) => {
        this.followersList = response;
        console.log(this.followersList);
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
        console.log(this.followingList);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  isFollowing(): void {
    this.followService.ifFollowing(this.currentUserId, this.searchedUserId).subscribe(
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
      this.followService.unfollow(this.currentUserId, this.searchedUserId).subscribe();
    } else {
      this.isCurrentUserFollowingSearchedUser = true;
      this.followService.follow(this.currentUserId, this.searchedUserId).subscribe();
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

  public onOpenViewPhoto(pictureId: number): void {
    this.getImage(pictureId);
  }

  // TODO: do poprawy
  public getAllPhotos(): void {
    this.http.get<ImageModel[]>(this.server + '/image/get/allphotos/' + this.searchedUserId).subscribe(
      (response: ImageModel[]) => {
        this.allPhotosResponse = response;

        this.allPhotosResponse.forEach(item => {
          item.picByte = 'data:image/jpeg;base64,' + item.picByte;
        });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getImage(imageId: number): void {
    this.http.get('http://localhost:8080/image/get/' + imageId)
      .subscribe(
        res => {
          this.retrieveResponse = res;
          this.base64Data = this.retrieveResponse.picByte;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
          this.selectedImage = this.retrievedImage;
        }
      );
  }
}
