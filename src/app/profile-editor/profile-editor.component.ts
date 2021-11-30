import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {User} from '../user';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {TokenStorageService} from '../_services/token-storage.service';
import {ImageService} from '../_services/image.service';
import {HttpErrorResponse} from '@angular/common/http';
import {UserService} from '../_services/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../_services/auth.service';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent implements OnInit {
  [x: string]: any;

  name = new FormControl('');

  title = 'angular-image-uploader';

  imageChangedEvent: any = '';
  croppedImage: any;

  selectedFile: File;
  croppedImageToFile: File;
  currentUser: User;

  nameForm = '';
  userNameForm = '';
  emailForm = '';
  editUser: User;
  currentUserData: User;

  newPasswordForm = '';
  newPasswordConfirmForm = '';

  fileChangeEvent(event): void {
    this.imageChangedEvent = event;
    this.selectedFile = event.target.files[0];
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  imageLoaded(): void {
    // show cropper
  }

  cropperReady(): void {
    // cropper ready
  }

  loadImageFailed(): void {
    // show message
  }

  constructor(private token: TokenStorageService,
              private imageService: ImageService,
              private userService: UserService,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();

    this.getUserData();
  }

  onUpload(): void {
    const uploadImageData = new FormData();

    this.croppedImageToFile = new File([base64ToFile(this.croppedImage)], this.selectedFile.name);
    uploadImageData.append('imageFile', this.croppedImageToFile, this.selectedFile.name);
    console.log(this.currentUser.id);

    this.imageService.uploadProfileImage(uploadImageData)
      .subscribe(
        (response) => {
          this.refresh();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
  }

  refresh(): void {
    window.location.reload();
  }

  public setDataInUserDataForm(): void {
    this.nameForm = this.editUser.name;
    this.emailForm = this.editUser.email;
    this.userNameForm = this.editUser.username;
  }

  public getUserData(): void {
    this.userService.getCurrentUser().subscribe(
      (response: User) => {
        this.currentUserData = response;
        this.editUser = this.currentUserData;

        this.setDataInUserDataForm();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onDeleteAccount(): void {
    this.userService.deleteOwnAccount(this.currentUser.id).subscribe(
      () => {
        alert('It was nice to have you in our community. Hope you will come back :(');
        this.token.signOut();
        this.router.navigate([`/register`]);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onPasswordChanged(): void {
    console.log(this.newPasswordForm);
    console.log(this.newPasswordConfirmForm);
    if (this.newPasswordForm === this.newPasswordConfirmForm) {

      this.userService.changePassword(this.currentUser.id, this.newPasswordForm).subscribe(
        () => {
          alert('Password changed! Now you will be logged out.');
          this.token.signOut();
          this.router.navigate([`/login`]);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  onEditUserData(): void {
    this.editUser.username = this.userNameForm;
    this.editUser.email = this.emailForm;
    this.editUser.name = this.nameForm;


    this.userService.updateUserData(this.editUser).subscribe(
      () => {
        alert('Data changed!');
        // this.token.signOut();
        // this.router.navigate([`/login`]);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
}

// base64 -> Blob -> new File(Blob, name) -> FormData()
export function base64ToFile(base64Image: string): Blob {
  const split = base64Image.split(',');
  const type = split[0].replace('data:', '').replace(';base64', '');
  const byteString = atob(split[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {type});


}
