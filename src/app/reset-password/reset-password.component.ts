import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  token!: string;
  email!: string;
  expiration!:string;
  backendError: string | null = null; 
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(private authService: AuthService, private route: ActivatedRoute,private formBuilder: FormBuilder,private router: Router) {}


  onMouseDownPassword(): void {
    this.hidePassword = false;
  }

  onMouseUpPassword(): void {
    this.hidePassword = true;
  }

  onMouseDownConfirmPassword(): void {
    this.hideConfirmPassword = false;
  }

  onMouseUpConfirmPassword(): void {
    this.hideConfirmPassword = true;
  }
  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]], 
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  
    this.route.queryParams.subscribe(params => {
        this.token = params['token'];
        this.email = params['email'];
        this.expiration =params['expiration'];
    });
  }
  
  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['confirmPassword'].value ? null : {'mismatch': true};
  }
  

  onSubmit() {
    if (this.resetPasswordForm.valid && this.token && this.email && this.expiration) {
      const newPassword = this.resetPasswordForm.value.password;
  
      console.log('Token:', this.token);
      console.log('Email:', this.email);
      console.log('Expiration:', this.expiration);
  
      this.authService.resetPassword(this.email, this.token, this.expiration, newPassword).subscribe(
        response => {
          console.log('Password reset successful', response);
          this.router.navigateByUrl('/login');
        },
        error => {
          this.backendError = error.error.detail || 'Failed to reset the password. Please try again.';
          console.error('Password reset failed', error);
        }
      );
    }
  }
  

}
