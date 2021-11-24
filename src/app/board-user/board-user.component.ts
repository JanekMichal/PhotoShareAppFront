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
import {CommentService} from '../_services/comment.service';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})

export class BoardUserComponent implements OnInit {

  allImagesResponse: ImageModel[];
  currentUser: User;
  currentUserId: number;
  description: string;

  areCommentsCollapsed = true;
  comments: CommentModel[];
  comment: CommentModel;
  commentsCount: number;
  commentsPageNumber = 0;
  imagesPageNumber = 0;
  imageWithLoadedCommentsId: number;
  areThereMoreComments = true;
  commentsLoadedCount = 0;

  constructor(private userService: UserService,
              private token: TokenStorageService,
              private http: HttpClient,
              private data: DataService,
              private imageService: ImageService,
              private likeService: LikeService,
              private commentService: CommentService
  ) {
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.currentUserId = this.currentUser.id;
    this.getFeedImagesPaged();
    console.log(this.allImagesResponse);
  }

  // ----------------------- COMMENTS -----------------------------
  public getCommentsCount(imageId: number): number {
    this.commentService.getCommentsCount(imageId).subscribe(
      (response: number) => {
        this.commentsCount = response;
        console.log('Response: ' + this.commentsCount);
      }
    );
    return this.commentsCount;
  }

  public addComment(userId: number, imageId: number, description: string): void {
    this.commentService.addComment(userId, imageId, description).subscribe(
      (response: number) => {
        this.commentsCount = response;
        this.getComments(imageId);
      }
    );
    this.description = ' ';

  }

  public deleteComment(commentId: number, imageId: number): void {
    this.commentService.deleteComment(commentId).subscribe(
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

  public getCommentsPaged(imageId: number): void {
    if (this.imageWithLoadedCommentsId !== imageId) {
      this.commentsPageNumber = 0;
    }
    this.commentService.getCommentsPaged(imageId, this.commentsPageNumber).subscribe(
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
        this.commentService.getCommentsCount(imageId).subscribe(
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
    this.commentService.getComments(imageId).subscribe(
      (response: CommentModel[]) => {
        this.comments = response;
        for (let i = 0; i < this.comments.length; i++) {
          this.userService.getUser(this.comments[i].ownerId).subscribe(
            (userResponse: User) => {
              this.comments[i].authorName = userResponse.username;
              this.commentService.getCommentsCount(this.allImagesResponse[i].id).subscribe(
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

  // ----------------------- LIKES -----------------------------
  public likeImage(image: ImageModel): void {
    this.likeService.addLike(image.id).subscribe();
    this.allImagesResponse[this.allImagesResponse.indexOf(image)].isLiked = true;
    this.allImagesResponse[this.allImagesResponse.indexOf(image)].likesCount++;
  }

  public deleteLike(image: ImageModel): void {
    this.likeService.addLike(image.id).subscribe();
    this.allImagesResponse[this.allImagesResponse.indexOf(image)].isLiked = false;
    this.allImagesResponse[this.allImagesResponse.indexOf(image)].likesCount--;
  }

  public getFeedImagesPaged(): void {
    this.imageService.getFeedImagesPaged(this.imagesPageNumber).subscribe(
      (response: ImageModel[]) => {
        response.forEach(item => {
          item.picByte = 'data:image/jpeg;base64,' + item.picByte;
          this.userService.getUser(item.ownerId).subscribe(
            (userResponse: User) => {
              item.name = userResponse.username;
            }
          );
          this.commentService.getCommentsCount(item.id).subscribe(
            (commentsCountResponse: number) => {
              item.commentsCount = commentsCountResponse;
            }
          );
          this.likeService.getLikesCount(item.id).subscribe(
            (likesCountResponse: number) => {
              item.likesCount = likesCountResponse;
            }
          );
          this.likeService.isUserLikingThisPhoto(item.id).subscribe(
            (isLikingResponse: boolean) => {
              item.isLiked = isLikingResponse;
            }
          );
        });
        this.imagesPageNumber++;
        if (this.allImagesResponse == null) {
          this.allImagesResponse = response;
        } else {
          this.allImagesResponse = this.allImagesResponse.concat(response);
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
