import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageModel } from '../ImageModel';
import { User } from '../user';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
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
  retrieveResonse: any;
  message: string;
  imageName: any;
  allPhotosResponse: ImageModel[];
  allPhotosData: any = [];

  constructor(private token: TokenStorageService, private userService: UserService, private http: HttpClient) { }

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
    this.getAllPhotos();
  }

  refresh(): void {
    window.location.reload();
  }

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
        console.log(response);
        this.nameForm = '';
        this.reloadPage();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

    this.userService.editUserName(user, this.userNameForm).subscribe(
      (response: User) => {
        console.log(response);
        this.userNameForm = '';
        this.reloadPage();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

    this.userService.editEmail(user, this.emailForm).subscribe(
      (response: User) => {
        console.log(response);
        this.emailForm = '';
        this.reloadPage();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  //  --------------------------------------- PHOTOS -----------------------------------------------

  public onFileChanged(event) {
    //Select File
    this.selectedFile = event.target.files[0];
  }

  public onDeleteImage(imageId: number) {
    this.http.delete<void>(this.server + '/image/delete/' + imageId).subscribe(
      (response: void) => {
        console.log(response);
        this.refresh();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  //Gets called when the user clicks on submit to upload the image
  onUpload() {
    this.reloadPage();
    console.log(this.selectedFile);
    //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);

    //Make a call to the Spring Boot Application to save the image
    this.http.post(this.server + '/image/upload/' + this.currentUser.id, uploadImageData, { observe: 'response' })
      .subscribe((response) => {

        if (response.status === 200) {
          this.message = 'Image uploaded successfully';
          
        } else {
          this.message = 'Image not uploaded successfully';

        }
      }
      );
    
  }
  //Gets called when the user clicks on retieve image button to get the image from back end
  public getAllPhotos(): void {
    this.http.get<ImageModel[]>(this.server + '/image/get/allphotos/' + this.currentUser.id).subscribe(
      (response: ImageModel[]) => {
        this.allPhotosResponse = response;
        
        for (let i = 0; i < this.allPhotosResponse.length; i++) {
          this.base64Data = this.allPhotosResponse[i].picByte;
          
          this.allPhotosData.push('data:image/jpeg;base64,' + this.base64Data);

          this.allPhotosResponse[i].picByte = this.allPhotosData[i];
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  getImage() {
    //Make a call to Sprinf Boot to get the Image Bytes.
    this.http.get('http://localhost:8080/image/get/' + this.imageName)
      .subscribe(
        res => {
          this.retrieveResonse = res;
          this.base64Data = this.retrieveResonse.picByte;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        }
      );
  }

}
