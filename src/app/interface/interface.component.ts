import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  email: string = '';
  token: string = '';
  expiration: string = '';
  password: string = '';
  userName: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute // Inject ActivatedRoute here
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userName = params['userName'];
    });
  }
  
  
  resetPassword() {
    this.authService.resetPassword(this.email, this.token, this.expiration, this.password)
      .subscribe(response => {
        // Handle response
      }, error => {
        // Handle error
      });
  }
}
