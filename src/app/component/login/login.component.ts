import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
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
      console.log('Login successful', this.loginForm.value);
    } else if (formType === 'signup' && this.signupForm.valid) {
      console.log('Signup successful', this.signupForm.value);
    }
  }
}
