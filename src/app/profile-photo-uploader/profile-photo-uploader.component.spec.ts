import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfilePhotoUploaderComponent} from './profile-photo-uploader.component';

describe('ProfilePhotoUploaderComponent', () => {
  let component: ProfilePhotoUploaderComponent;
  let fixture: ComponentFixture<ProfilePhotoUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilePhotoUploaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePhotoUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
