import {Component, OnInit} from '@angular/core';
import {ImageModel} from '../ImageModel';
import {TokenStorageService} from '../_services/token-storage.service';
import {UserService} from '../_services/user.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {User} from '../user';
import {DataService} from '../_services/data.service';
import {CommentModel} from '../CommentModel';
import {ImageService} from '../_services/image.service';
import {LikeService} from '../_services/like.service';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})

export class BoardUserComponent implements OnInit {

  allImagesResponse: ImageModel[];
  currentUser: any;
  currentUserId: number;
  description: string;

  areCommentsCollapsed = true;
  comments: CommentModel[];
  comment: CommentModel;
  commentsCount: number;
  commentsPageNumber = 0;
  commentsPageSize = 5;
  imageWithLoadedCommentsId: number;
  areThereMoreComments = true;
  commentsLoadedCount = 0;

  constructor(private userService: UserService,
              private token: TokenStorageService,
              private http: HttpClient,
              private data: DataService,
              private imageService: ImageService,
              private likeService: LikeService) {
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.currentUserId = this.currentUser.id;
    this.getFeedImages();
  }

  public getCommentsCount(imageId: number): number {
    this.imageService.getCommentsCount(imageId).subscribe(
      (response: number) => {
        this.commentsCount = response;
        console.log('Response: ' + this.commentsCount);
      }
    );
    return this.commentsCount;
  }

  public addComment(userId: number, imageId: number, description: string): void {
    this.imageService.addComment(userId, imageId, description).subscribe(
      (response: number) => {
        this.commentsCount = response;
        this.getComments(imageId);
      }
    );
    this.description = ' ';

  }

  public deleteComment(commentId: number, imageId: number): void {
    this.imageService.deleteComment(commentId).subscribe(
      () => this.getComments(imageId)
    );
  }

  public commentsButtonClick(imageId: number): void {
    if (this.areCommentsCollapsed === true || this.imageWithLoadedCommentsId !== imageId) {
      this.areCommentsCollapsed = false;
      this.areThereMoreComments = true;
      this.getCommentsPaged(imageId);
    } else {
      this.areThereMoreComments = false;
      this.areCommentsCollapsed = true;
    }
  }

  public likeImage(image: ImageModel): void {
    console.log(image);
    this.likeService.addLike(image.id).subscribe();
    this.allImagesResponse[image.index].isLiked = true;
    this.allImagesResponse[image.index].likesCount++;
  }

  public deleteLike(image: ImageModel): void {
    console.log(image);
    this.likeService.addLike(image.id).subscribe();
    this.allImagesResponse[image.index].isLiked = false;
    this.allImagesResponse[image.index].likesCount--;
  }

  public getCommentsPaged(imageId: number): void {
    if (this.imageWithLoadedCommentsId !== imageId) {
      this.commentsPageNumber = 0;
    }
    this.imageService.getCommentsPaged(imageId, this.commentsPageNumber).subscribe(
      (response: CommentModel[]) => {
        if (this.imageWithLoadedCommentsId !== imageId) {
          this.imageWithLoadedCommentsId = imageId;
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
        this.imageService.getCommentsCount(imageId).subscribe(
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

  public getComments(imageId: number): void {
    this.imageService.getComments(imageId).subscribe(
      (response: CommentModel[]) => {
        this.comments = response;
        for (let i = 0; i < this.comments.length; i++) {
          this.userService.getUser(this.comments[i].ownerId).subscribe(
            (userResponse: User) => {
              this.comments[i].authorName = userResponse.username;
              this.imageService.getCommentsCount(this.allImagesResponse[i].id).subscribe(
                (commentsCountResponse: number) => {
                  this.allImagesResponse[i].commentsCount = commentsCountResponse;
                }
              );
            }
          );
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getFeedImages(): void {
    this.imageService.getFeedImages().subscribe(
      (response: ImageModel[]) => {
        this.allImagesResponse = response;
        for (let i = 0; i < this.allImagesResponse.length; i++){
          const item = this.allImagesResponse[i];
          this.allImagesResponse[i].index = i;
          item.picByte = 'data:image/jpeg;base64,' + item.picByte;
          this.userService.getUser(item.ownerId).subscribe(
            (userResponse: User) => {
              item.name = userResponse.username;
            }
          );
          this.imageService.getCommentsCount(item.id).subscribe(
            (commentsCountResponse: number) => {
              item.commentsCount = commentsCountResponse;
            }
          );
          this.likeService.getLikesCount(item.id).subscribe(
            (likesCountResponse: number) => {
              console.log(likesCountResponse);
              item.likesCount = likesCountResponse;
            }
          );
          this.likeService.isUserLikingThisPhoto(item.id).subscribe(
            (isLikingResponse: boolean) => {
              console.log(isLikingResponse);
              item.isLiked = isLikingResponse;
            }
          );
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onViewUserProfile(id: number): void {
    this.data.setSearchedUserId(id);
  }
}
