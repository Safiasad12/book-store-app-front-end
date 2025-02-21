import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { Observable } from 'rxjs';

interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService: HttpService) { }

  userLoginApiCall(user: any): Observable<LoginResponse> {
    return this.httpService.postApiCall<LoginResponse>("http://localhost:3000/api/v1/user/", user);
  }

  userSignupApiCall(user: any) {
    return this.httpService.postApiCall("http://localhost:3000/api/v1/user/signup", user);
  }
}
