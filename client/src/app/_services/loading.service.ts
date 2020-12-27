import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private spinner: NgxSpinnerService) { }

  show(){
    this.spinner.show(
      undefined, {
        type: 'line-scale-pulse-out-rapid',
        size: 'medium',
        color: '#772953',
        bdColor: 'rgba(255, 255, 255, 0)'
      }
    )
  }

  hide(){
    this.spinner.hide()
  }
}
