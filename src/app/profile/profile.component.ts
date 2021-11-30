import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ImageModel} from '../ImageModel';
import {User} from '../user';
import {TokenStorageService} from '../_services/token-storage.service';
import {UserService} from '../_services/user.service';
import {FollowService} from '../_services/follow.service';
import {ImageService} from '../_services/image.service';
import {CommentModel} from '../CommentModel';
import {CommentService} from '../_services/comment.service';
import {DataService} from '../_services/data.service';
import {LikeService} from '../_services/like.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  [x: string]: any;

  // -------------- User --------------
  currentUser: User;

  // -------------- FOLLOW --------------
  followingCount: number;
  followersCount: number;
  followersList: User[];
  followingList: User[];

  // -------------- IMAGES --------------
  descriptionFormTextArea = '';
  selectedFile: File;
  profilePhoto: ImageModel;
  allImagesResponse: ImageModel[];
  selectedImage: ImageModel;
  selectedDeleteImage: ImageModel;

  // -------------- UPLOADING IMAGES --------------
  acceptableFileTypes = ['image/jpeg', 'image.png'];
  isImageValid = false;
  maxImageSize = 5242880; // 5MB

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
              private followService: FollowService,
              private imageService: ImageService,
              private commentService: CommentService,
              private dataService: DataService,
              private likeService: LikeService
  ) {
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();

    this.getAllImages();
    this.getProfileImage();


    this.getFollowingCount();
    this.getFollowersCount();
    this.getFollowers();
    this.getFollowing();
  }

  //  --------------------------------------- FOLLOWERS -----------------------------------------------
  public getFollowers(): void {
    this.followService.getFollowers(this.currentUser.id).subscribe(
      (response: User[]) => {
        this.followersList = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getFollowing(): void {
    this.followService.getFollowing(this.currentUser.id).subscribe(
      (response: User[]) => {
        this.followingList = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onUnfollow(removedUserId: number): void {
    this.followService.unfollow(this.currentUser.id, removedUserId).subscribe();
    this.getFollowing();
  }

  public onRemove(removedUserId: number): void {
    this.followService.unfollow(removedUserId, this.currentUser.id).subscribe();
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
    this.imageService.changeDescription(this.selectedImage.id, this.descriptionFormTextArea).subscribe(
      () => {
        this.selectedImage.description = this.descriptionFormTextArea;
        const index = this.allImagesResponse.indexOf(this.selectedImage);
        this.allImagesResponse[index] = this.selectedImage;
      }
    );
  }

  onOpenDescriptionModal(image: ImageModel): void {
    this.selectedImage = image;
    this.descriptionFormTextArea = image.description;
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

  //  --------------------------------------- COMMENTS -----------------------------------------------
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
