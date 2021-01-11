import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {

  @Input() appHasRole: string[];
  user: User;

  constructor(
    private templateRef: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private accountService: AccountService) {
    this.accountService.userResource$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })
  }
  ngOnInit(): void {
    if (!this.user?.roles || this.user == null) {
      this.vcr.clear();
      return;
    } else {
      if (this.user.roles.some(r => this.appHasRole.includes(r))) {
        this.vcr.createEmbeddedView(this.templateRef);
      } else {
        this.vcr.clear();
      }
    }
  }
}
