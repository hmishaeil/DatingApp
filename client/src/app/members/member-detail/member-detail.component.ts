import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/Member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  member: Member

  constructor(private memberService: MembersService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember()

    this.galleryOptions = [
      {
        width: '400px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];

  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = []
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url,
      })
    }

    imageUrls && imageUrls.push({
      small: './assets/user.png',
      medium: './assets/user.png',
      big: './assets/user.png',
    });
    
    return imageUrls;

  }
  loadMember() {
    this.memberService.getMember(this.activatedRoute.snapshot.paramMap.get('username')).subscribe(
      res => {
        this.member = res
        this.galleryImages = this.getImages();
      }
    )
  }
}
