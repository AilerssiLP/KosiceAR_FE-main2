import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup =undefined!;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService,private router: Router) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      district: ['', Validators.required] 
    });
    
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.registerUser(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          //this.router.navigateByUrl('/login'); 
        },
        error: (error) => {
          console.error('Registration failed', error);
          this.errorMessage = error.error ? error.error : 'Registration failed. Please try again.';
        }
      });
    }
  }
  
  
  
}