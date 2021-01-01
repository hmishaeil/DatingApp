import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() usersFromHomeComponent;
  @Output() outputFromRegisterComponent = new EventEmitter();

  model: any = {};
  validationErrors = []
  registerForm: FormGroup
  errors: string[] = [] // Init the variable, otherwise getting undefined var

  constructor(private accountService: AccountService, private toastr: ToastrService, 
    private router: Router,
    private memberService: MembersService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    // Following snippet can be more shortened by using the FromBuilder service above.
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      gender: new FormControl('male'),
      knownAs: new FormControl('', Validators.required),
      dateOfBirth: new FormControl(null, Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, this.confirmPasswordValidator('password')]),
    })
  }

  confirmPasswordValidator(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : { matched: true }
    }
  }

  onRegisterSubmit() {
    this.accountService.register(this.registerForm.value).subscribe((res) => {
      this.toastr.info('user registered successfully!');

      this.memberService.members.push(this.registerForm.value)
      this.router.navigateByUrl('members')


    }, (err) => {
      // Catch and handle the back-end errors 
      this.errors = err

    });
  }
  onRegisterCancel() {
    this.outputFromRegisterComponent.emit(false);
  }
}
