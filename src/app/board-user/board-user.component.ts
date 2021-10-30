import { Component, OnInit } from '@angular/core';
import { ImageModel } from '../ImageModel';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../user';
import { DataService } from '../_services/data.service';
import { CommentModel } from '../CommentModel';
import { ImageService } from '../_services/image.service';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/image/';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})

export class BoardUserComponent implements OnInit {

  allImagesResponse: ImageModel[];
  currentUser: any;
  currentUserId: number;
  description: String;

  areCommentsCollapsed: boolean = true;
  comments: CommentModel[];
  comment: CommentModel;
  commentsCount: number;
  commentsPageNumber: number = 0;
  //commentsPageSize: number = 5;
  imageWithLoadedCommentsId: number;
  areThereMoreComments: boolean = true;
  commentsLoadedCount: number = 0;

  constructor(private userService: UserService,
    private token: TokenStorageService,
    private http: HttpClient,
    private data: DataService,
    private imageService: ImageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.currentUserId = this.currentUser.id;
    this.getFeedImages();
  }

  public getCommentsCount(imageId: number): number {
    this.imageService.getCommentsCount(imageId).subscribe(
      (response: number) => {
        this.commentsCount = response
        console.log("Response: " + this.commentsCount)
      }
    );
    return this.commentsCount;
  }

  public addComment(userId: number, imageId: number, description: String): void {
    this.imageService.addComment(userId, imageId, description).subscribe(
      (response: number) => {
        this.commentsCount = response;
        this.getComments(imageId);
      }
    );
    this.description = ' ';

  }

  public deleteComment(commentId: number, imageId: number) {
    this.imageService.deleteComment(commentId).subscribe(
      () => this.getComments(imageId)
    );
  }

  public commentsButtonClick(imageId: number) {
    if (this.areCommentsCollapsed == true || this.imageWithLoadedCommentsId != imageId) {
      this.areCommentsCollapsed = false;
      this.areThereMoreComments = true;
      this.getCommentsPaged(imageId)
    } else {
      this.areThereMoreComments = false
      this.areCommentsCollapsed = true;
    }
  }

  public getCommentsPaged(imageId: number): void {
    if (this.imageWithLoadedCommentsId != imageId) {
      this.commentsPageNumber = 0;
    }
    this.imageService.getCommentsPaged(imageId, this.commentsPageNumber).subscribe(
      (response: CommentModel[]) => {
        if (this.imageWithLoadedCommentsId != imageId) {
          this.imageWithLoadedCommentsId = imageId;
          this.comments = response;
          this.commentsLoadedCount = response.length
        } else {
          this.comments = this.comments.concat(response);
          this.commentsLoadedCount = this.commentsLoadedCount + response.length
        }

        for (let i = 0; i < this.comments.length; i++) {
          this.userService.getUser(this.comments[i].ownerId).subscribe(
            (response: User) => {
              this.comments[i].authorName = response.username
            }
          );
        }
        this.imageService.getCommentsCount(imageId).subscribe(
          (response: number) => {
            this.commentsCount = response
            if (this.commentsLoadedCount == this.commentsCount) {
              this.areThereMoreComments = false
            } else {
              this.areThereMoreComments = true
            }
          }
        )
        this.commentsPageNumber++
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
            (response: User) => {
              this.comments[i].authorName = response.username;
              this.imageService.getCommentsCount(this.allImagesResponse[i].id).subscribe(
                (response: number) => {
                  this.allImagesResponse[i].commentsCount = response;
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
    this.imageService.getFeedImages(this.currentUser.id).subscribe(
      (response: ImageModel[]) => {
        this.allImagesResponse = response;
        for (let i = 0; i < this.allImagesResponse.length; i++) {
          this.allImagesResponse[i].picByte = 'data:image/jpeg;base64,' + this.allImagesResponse[i].picByte;
          this.userService.getUser(this.allImagesResponse[i].ownerId).subscribe(
            (response: User) => {
              this.allImagesResponse[i].name = response.username;
            }
          );
          this.imageService.getCommentsCount(this.allImagesResponse[i].id).subscribe(
            (response: number) => {
              this.allImagesResponse[i].commentsCount = response;
            }
          );
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onViewUserProfile(id: number) {
    this.data.setSearchedUserId(id);
  }
}
