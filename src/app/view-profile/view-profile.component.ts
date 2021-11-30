import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ImageModel} from '../ImageModel';
import {User} from '../user';
import {DataService} from '../_services/data.service';
import {FollowService} from '../_services/follow.service';
import {TokenStorageService} from '../_services/token-storage.service';
import {UserService} from '../_services/user.service';
import {ImageService} from '../_services/image.service';
import {CommentModel} from '../CommentModel';
import {CommentService} from '../_services/comment.service';
import {LikeService} from '../_services/like.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  [x: string]: any;

  // -------------- User --------------
  currentUser: User;
  searchedUser: User;

  // -------------- FOLLOW --------------
  isCurrentUserFollowingSearchedUser: boolean;
  followingCount: number;
  followersCount: number;
  followersList: User[];
  followingList: User[];

  // -------------- IMAGES --------------
  selectedFile: File;
  profilePhoto: ImageModel;
  allImagesResponse: ImageModel[];
  selectedImage: ImageModel;
  selectedDeleteImage: ImageModel;

  // -------------- COMMENTS --------------
  commentsPageNumber = 0;
  commentsLoadedCount = 0;
  commentsCount: number;
  areThereMoreComments = true;
  comments: CommentModel[];
  comment: CommentModel;
  areCommentsCollapsed = true;
  description: string;

  constructor(private token: TokenStorageService,
              private userService: UserService,
              private http: HttpClient,
              private data: DataService,
              private followService: FollowService,
              private imageService: ImageService,
              private commentService: CommentService,
              private likeService: LikeService
  ) {
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.data.searchedUserId.subscribe(message => {
      this.searchedUserId = message;
      this.loadAllData();
    });
  }

  public loadAllData(): void {
    this.userService.getUser(this.searchedUserId).subscribe(
      (response: User) => {
        this.searchedUser = response;
        this.isFollowing();
        this.getAllImages();
        this.getFollowers();
        this.getFollowing();
        this.getFollowersCount();
        this.getFollowingCount();
        this.getProfileImage();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onDeleteAccount(): void {
    this.userService.deleteSomeoneElseAccount(this.searchedUserId).subscribe(
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
    this.followService.getFollowing(this.searchedUser.id).subscribe(
      (response: User[]) => {
        this.followingList = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  isFollowing(): void {
    this.followService.ifFollowing(this.currentUser.id, this.searchedUser.id).subscribe(
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
      this.followService.unfollow(this.currentUser.id, this.searchedUser.id).subscribe();
    } else {
      this.isCurrentUserFollowingSearchedUser = true;
      this.followService.follow(this.currentUser.id, this.searchedUser.id).subscribe();
    }
  }

  public getFollowingCount(): void {
    this.followService.getFollowingCount(this.searchedUser.id).subscribe(
      (response: number) => {
        this.followingCount = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getFollowersCount(): void {
    this.followService.getFollowersCount(this.searchedUser.id).subscribe(
      (response: number) => {
        this.followersCount = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  // -------------------------------- IMAGES -------------------------------

  public getAllImages(): void {
    this.imageService.getAllImages(this.searchedUser.id).subscribe(
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

  public onOpenImageModal(image: ImageModel): void {
    this.selectedImage = image;
    this.resetCommentsData();
    this.commentService.getCommentsCount(image.id).subscribe(
      (commentsCountResponse: number) => {
        image.commentsCount = commentsCountResponse;
      }
    );

    this.likeService.getLikesCount(image.id).subscribe(
      (likesCountResponse: number) => {
        image.likesCount = likesCountResponse;
      }
    );

    this.likeService.isUserLikingThisPhoto(image.id).subscribe(
      (isLikingResponse: boolean) => {
        image.isLiked = isLikingResponse;
      }
    );
  }

  public onOpenDeleteModal(image: ImageModel): void {
    this.selectedDeleteImage = image;
  }

  public getProfileImage(): void {
    this.imageService.getProfileImage(this.searchedUser.id).subscribe(
      (res: ImageModel) => {
        if (res != null) {
          this.profilePhoto = res;
          this.profilePhoto.picByte = 'data:image/jpeg;base64,' + res.picByte;
        }
      }
    );
  }

  public onDeleteImage(image: ImageModel): void {
    this.imageService.deleteSomeoneImage(image.id).subscribe(
      () => {
        const index = this.allImagesResponse.indexOf(image);
        if (index > -1) {
          this.allImagesResponse.splice(index, 1);
        }
      }
    );
  }

  public giveRole(role: string): void {
    this.userService.giveRole(this.searchedUserId, role).subscribe(
      (response: User) => {
        console.log(response);
      }
    );
  }

  public getCommentsPaged(): void {
    this.commentService.getCommentsPaged(this.selectedImage.id, this.commentsPageNumber).subscribe(
      (response: CommentModel[]) => {
        if (this.commentsLoadedCount === 0) {
          this.comments = response;
          this.commentsLoadedCount = response.length;
        } else {
          this.comments = this.comments.concat(response);
          this.commentsLoadedCount = this.commentsLoadedCount + response.length;
        }

        this.comments.forEach(comment => {
          this.userService.getUser(comment.ownerId).subscribe(
            (userResponse: User) => {
              comment.authorName = userResponse.username;
            }
          );
        });
        this.commentService.getCommentsCount(this.selectedImage.id).subscribe(
          (commentsCountResponse: number) => {
            this.commentsCount = commentsCountResponse;
            if (this.commentsLoadedCount === this.commentsCount) {
              this.areThereMoreComments = false;
            } else {
              this.areThereMoreComments = true;
            }
          }
        );
        this.commentsPageNumber++;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public commentsButtonClick(): void {
    if (this.areCommentsCollapsed === true) {
      this.areCommentsCollapsed = false;
      this.areThereMoreComments = true;
      this.getCommentsPaged();
    } else {
      this.areThereMoreComments = false;
      this.areCommentsCollapsed = true;
    }
  }

  public addComment(description: string): void {
    this.commentService.addComment(this.currentUser.id, this.selectedImage.id, description).subscribe(
      (response: CommentModel) => {
        this.commentService.getCommentsCount(this.selectedImage.id).subscribe(
          (commentsCountResponse: number) => {
            const index = this.allImagesResponse.indexOf(this.selectedImage);
            this.allImagesResponse[index].commentsCount = commentsCountResponse;
          }
        );
        this.comments.unshift(response);
        this.userService.getUser(this.comments[0].ownerId).subscribe(
          (userResponse: User) => {
            this.comments[0].authorName = userResponse.username;
          }
        );
      }
    );
    this.description = ' ';
  }

  resetCommentsData(): void {
    this.commentsPageNumber = 0;
    this.commentsLoadedCount = 0;
    this.commentsCount = 0;
    this.areThereMoreComments = true;
    this.comments = null;
    this.comment = null;
    this.areCommentsCollapsed = true;
    this.description = '';
  }

  public deleteComment(comment: CommentModel, imageModel: ImageModel): void {
    this.commentService.deleteComment(comment.id).subscribe(
      () => {
        const commentIndex = this.comments.indexOf(comment);
        this.comments.splice(commentIndex, 1);

        this.commentService.getCommentsCount(imageModel.id).subscribe(
          (commentsCountResponse: number) => {
            const index = this.allImagesResponse.indexOf(imageModel);
            this.allImagesResponse[index].commentsCount = commentsCountResponse;
          }
        );
      }
    );
  }

  public likeImage(): void {
    this.likeService.addLike(this.selectedImage.id).subscribe(
      () => {
        this.allImagesResponse[this.allImagesResponse.indexOf(this.selectedImage)].isLiked = true;
        this.allImagesResponse[this.allImagesResponse.indexOf(this.selectedImage)].likesCount++;
      }
    );
  }

  public deleteLike(): void {
    this.likeService.deleteLike(this.selectedImage.id).subscribe(
      () => {
        this.allImagesResponse[this.allImagesResponse.indexOf(this.selectedImage)].isLiked = false;
        this.allImagesResponse[this.allImagesResponse.indexOf(this.selectedImage)].likesCount--;
      }
    );
  }

  onViewUserProfile(id: number): void {
    this.dataService.setSearchedUserId(id);
  }
}
