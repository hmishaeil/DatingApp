import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  validationErrors = []
  constructor(private router: Router, private toastr: ToastrService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        console.log('*** ERROR DETECTED IN INTERCEPTOR ***')
        console.log(err)
        switch (err.status) {
          case 400:
            console.log('400 detected'!)
            if(err.error.errors){
              for(const k in err.error.errors){
                if(err.error.errors[k]){
                  this.validationErrors.push(err.error.errors[k])
                }
              }

              throw(this.validationErrors.flat());
            } else{
              this.toastr.error('bad request! - todo')
            }
            break;
          case 401:
            this.toastr.error('unauthorized!')
            break;
          case 404:
            console.log('404 detected'!)
            this.router.navigateByUrl('not-found')
            break;
          case 500:
            console.log('500 detected'!)
            this.router.navigateByUrl('internal-server-error', {
              state: {
                error: err.error
              }
            })
            break;
          default:
            break;
        }
        return throwError(err)
      })
    );
  }
}
