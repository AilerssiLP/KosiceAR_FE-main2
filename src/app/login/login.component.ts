import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = { email: '', password: '' };
  isLoggedIn = false;
  userName: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  onLoginSubmit() {
    this.authService.loginUser(this.user).subscribe(
      (response: any) => {
        this.isLoggedIn = true;
        this.userName = this.user.email;
        console.log('Login successful', response);

        // Navigate to the interface route with userName as a query parameter
        this.router.navigate(['/interface'], { queryParams: { userName: this.userName } });
      },
      (error: any) => {
        console.error('Login failed', error);
      }
    );
  }
}
