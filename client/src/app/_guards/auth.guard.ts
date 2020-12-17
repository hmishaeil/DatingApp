import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { map } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountService, private toastr: ToastrService){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.accountService.userResource$.pipe(
        map(res => {
          if(res){
            return true;
          } else {
            this.toastr.error('you are not authorized!')
          }
        })
      );
  }
  
}
