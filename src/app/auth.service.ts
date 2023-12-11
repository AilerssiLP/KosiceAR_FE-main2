import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerUrl = 'https://localhost:7047/api/AdministrationController/registernewuser';
  private loginUrl = 'https://localhost:7047/api/Auth/login';
  private resetpassUrl ='https://localhost:7047/api/auth/register';
  constructor(private http: HttpClient) {}
  /*
  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    const data = { email, token, newPassword };
    return this.http.post(this.resetpassUrl, data, {
        headers: { 'Content-Type': 'application/json' }
    });
  }

resetPassword(email: string, token: string, newPassword: string): Observable<any> {
  const data = new HttpParams()
      .set('email', email)
      .set('token', token)
      .set('password', newPassword);
  return this.http.post(this.resetpassUrl, data.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}


resetPassword(email: string, token: string, newPassword: string): Observable<any> {
  // Set the HTTP params for email and token
  let params = new HttpParams()
    .set('email', email)
    .set('token', token);


  const requestBody = JSON.stringify(newPassword);


  return this.http.post(this.resetpassUrl, requestBody, {
    headers: { 'Content-Type': 'application/json' },
    params: params
  });
}*/
resetPassword(email: string, token: string, expiration: string, password: string): Observable<any> {
  const params = new HttpParams()
    .set('email', email)
    .set('token', token)
    .set('expiration', expiration);

  const requestBody = { password: password };

  return this.http.post(this.resetpassUrl, requestBody, {
    params: params
  });
}



  registerUser(userData: any): Observable<any> {
    const registrationData = {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      district: userData.district
    };
    return this.http.post(this.registerUrl, registrationData);
  }
  
  

  loginUser(user: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(this.loginUrl, user, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
