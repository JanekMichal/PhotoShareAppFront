import { Component, OnInit } from '@angular/core';
import { ImageModel } from '../ImageModel';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../user';
import { DataService } from '../_services/data.service';
import { CommentModel } from '../CommentModel';
import { ImageService } from '../_services/image.service';

const API_URL = 'http://localhost:8080/image/';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})

export class BoardUserComponent implements OnInit {

  allPhotosResponse: ImageModel[];
  currentUser: any;
  currentUserId: number;
  comments: CommentModel[];
  comment: CommentModel;
  areCommentsCollapsed: boolean = true;
  description: String;
  commentsCount: number;

  constructor(private userService: UserService,
    private token: TokenStorageService,
    private http: HttpClient,
    private data: DataService,
    private imageService: ImageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.currentUserId = this.currentUser.id;
    this.getFeedPhotos();
  }

  public getCommentsCount(photoId: number):void {
    this.imageService.getCommentsCount(photoId).subscribe(
      () => this.commentsCount
    );
  }

  public addComment(userId: number, photoId: number, description: String): void {
    this.imageService.addComment(userId, photoId, description).subscribe(
      (response: number) => {
        this.commentsCount = response;
        this.getComments(photoId);
       
      } 
    );
    this.description = ' ';
    
  }

  public deleteComment(commentId: number, photoId: number) {
    this.imageService.deleteComment(commentId).subscribe(
      () => this.getComments(photoId)
    );
  }

  public getComments(photoId: number): void {
    this.imageService.getComments(photoId).subscribe(
      (response: CommentModel[]) => {
        this.comments = response;
        for (let i = 0; i < this.comments.length; i++) {
          this.userService.getUser(this.comments[i].ownerId).subscribe(
            (response: User) => {
              this.comments[i].authorName = response.username;
              this.imageService.getCommentsCount(this.allPhotosResponse[i].id).subscribe(
                (response: number) => {
                  this.allPhotosResponse[i].commentsCount = response;
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
    this.areCommentsCollapsed = false;
  }

  public getFeedPhotos(): void {
    this.http.get<ImageModel[]>(API_URL + "get_feed_photos/" + this.currentUserId).subscribe(
      (response: ImageModel[]) => {
        this.allPhotosResponse = response;
        for (let i = 0; i < this.allPhotosResponse.length; i++) {
          this.allPhotosResponse[i].picByte = 'data:image/jpeg;base64,' + this.allPhotosResponse[i].picByte;
          this.userService.getUser(this.allPhotosResponse[i].ownerId).subscribe(
            (response: User) => {
              this.allPhotosResponse[i].name = response.username;
            }
          );
          this.imageService.getCommentsCount(this.allPhotosResponse[i].id).subscribe(
            (response: number) => {
              this.allPhotosResponse[i].commentsCount = response;
            }
          );
          //console.log(this.allPhotosResponse[i].description);
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
