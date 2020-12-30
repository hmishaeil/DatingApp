import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/Member';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() member: Member;
  uploader: FileUploader
  hasBaseDropZoneOver: boolean
  baseUrl: string = environment.apiUrl
  user: User

  constructor(private accountService: AccountService, private memberService: MembersService) {
    this.accountService.userResource$.pipe(take(1)).subscribe(res => this.user = res)
  }

  ngOnInit(): void {
    this.initUploader()
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e
  }

  initUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    })

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, header) => {
      if (response) {
        const photo: Photo = JSON.parse(response)
        this.member.photos.push(photo)
        if (photo.isMain) {
          this.member.photoUrl = photo.url

          this.user.photoUrl = photo.url
          this.accountService.setCurrentUser(this.user)
        }

      }
    }
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe(
      () => {
        this.member.photos.forEach(
          (p) => {
            if (p.isMain) p.isMain = false
            if (p.id === photo.id) {
              p.isMain = true
              this.user.photoUrl = p.url
              this.accountService.setCurrentUser(this.user)

              this.member.photoUrl = p.url
            }
          }
        )
      }
    )
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo.id).subscribe(
      () => {
        this.member.photos = this.member.photos.filter(p => p.id !== photo.id)
      }
    );
  }

}
