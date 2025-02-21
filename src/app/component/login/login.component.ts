import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user-service/user.service';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { DataService } from 'src/app/service/data-service/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  signupForm: FormGroup;
  isLogin = true;
  submitted = false;
  passwordVisible = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private dataService: DataService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.signupForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }

  toggleForm(formType: string) {
    this.isLogin = formType === 'login';
    this.submitted = false;
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(formType: string) {
    this.submitted = true;

    if (formType === 'login' && this.loginForm.valid) {
      this.userService.userLoginApiCall(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('Login successful', res);
          this.authService.setToken(res.accessToken);
          this.dataService.syncCartWithBackend();
        },
        error: (err) => {
          console.error('Login failed', err);
        }
      });
    }

    else if (formType === 'signup' && this.signupForm.valid) {
      this.userService.userSignupApiCall(this.signupForm.value).subscribe({
        next: (res) => {
          console.log('Signup successful', res);
        },
        error: (err) => {
          console.error('Signup failed', err);
        }
      });
    }
  }
}