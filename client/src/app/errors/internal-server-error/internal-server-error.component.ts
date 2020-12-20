import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-internal-server-error',
  templateUrl: './internal-server-error.component.html',
  styleUrls: ['./internal-server-error.component.css']
})
export class InternalServerErrorComponent implements OnInit {

  err: any;

  constructor(private router: Router) { 
    this.err = router.getCurrentNavigation()?.extras?.state?.error;
  }

  ngOnInit(): void {
  }

  backToHome(){
    this.router.navigateByUrl('/')
  }

}
