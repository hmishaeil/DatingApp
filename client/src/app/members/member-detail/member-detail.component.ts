import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/Member';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  @ViewChild('memberTabs', {
    static: true
  }) memberTabs: TabsetComponent; // It is used to access to the template elements
  activeTab: TabDirective;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  member: Member
  messages: Message[] = [];

  constructor(
    //private memberService: MembersService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    public presenceService: PresenceService,
    ) { }

  ngOnInit(): void {
    // Commented as we are going to use the route resolver
    // this.loadMember()

    this.activatedRoute.data.subscribe(data => {
      this.member = data.member;
      this.galleryImages = this.getImages();
    })

    this.activatedRoute.queryParams.subscribe(params => {
      if (params?.tab === 'Messages') {
        this.activateTab('Messages');
      }
    })
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

  activateTab(tabId: string) {
    let tabs = this.memberTabs.tabs;
    tabs.forEach(tab => {
      if (tab.heading === tabId) {
        tab.active = true;
        return;
      }
    });
  }

  onTabActivated(data: TabDirective) {
    console.log(data)
    if (data.heading === 'Messages') {
      this.loadMemberMessages()
    }
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

    imageUrls.length == 0 && imageUrls.push({
      small: './assets/user.png',
      medium: './assets/user.png',
      big: './assets/user.png',
    });

    return imageUrls;

  }

  // loadMember() {
  //   this.memberService.getMember(this.activatedRoute.snapshot.paramMap.get('username')).subscribe(
  //     res => {
  //       this.member = res
  //       this.galleryImages = this.getImages();
  //     }
  //   )
  // }

  loadMemberMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe((res: Message[]) => {
      this.messages = res;
    })
  }
}
