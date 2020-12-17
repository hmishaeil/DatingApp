import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() usersFromHomeComponent;
  @Output() outputFromRegisterComponent = new EventEmitter();

  model: any = {};

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onRegisterSubmit() {
    this.accountService.register(this.model).subscribe((res) => {
      this.toastr.info('user registered successfully!');
    }, (err) => {
      this.toastr.error(err.error);
    })
  }
  onRegisterCancel() {
    this.outputFromRegisterComponent.emit(false);
  }
}
