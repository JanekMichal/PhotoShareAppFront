import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {User} from '../user';
import {ImageService} from '../_services/image.service';
import {TokenStorageService} from '../_services/token-storage.service';

@Component({
  selector: 'app-profile-photo-uploader',
  templateUrl: './profile-photo-uploader.component.html',
  styleUrls: ['./profile-photo-uploader.component.css']
})


export class ProfilePhotoUploaderComponent implements OnInit {

  title = 'angular-image-uploader';

  imageChangedEvent: any = '';
  croppedImage: any = '';

  selectedFile: File;
  croppedImageToFile: File;
  currentUser: User;

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
              private imageService: ImageService) {
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

  onUpload(): void {
    const uploadImageData = new FormData();

    this.croppedImageToFile = new File([base64ToFile(this.croppedImage)], this.selectedFile.name);
    uploadImageData.append('imageFile', this.croppedImageToFile, this.selectedFile.name);
    console.log(this.currentUser.id);

    this.imageService.uploadProfileImage(this.currentUser.id, uploadImageData)
      .subscribe(
        (response) => {
          console.log(response);
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
