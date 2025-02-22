import { Component, EventEmitter, Optional, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user-service/user.service';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { DataService } from 'src/app/service/data-service/data.service';
import { CartService } from 'src/app/service/cart-service/cart.service';
import { MatDialogRef } from '@angular/material/dialog'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>(); 

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
    private cartService: CartService,
    @Optional() public dialogRef: MatDialogRef<LoginComponent>
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

          this.cartService.fetchCartListApiCall().subscribe({
            next: (cartRes) => {
              const backendCart = cartRes.data?.books || [];
              const localCart = this.dataService.getCartItems();
              let updatedCart = this.mergeLocalIntoBackend(localCart, backendCart);

              if (updatedCart.length > 0) {
                this.cartService.updateCartListApiCall(updatedCart).subscribe({
                  next: () => {
                    console.log('Backend cart updated successfully');
                    this.dataService.updateCart(backendCart.concat(updatedCart));
                    localStorage.removeItem('cartItems');

                    this.loginSuccess.emit(); 
                    this.closeDialog();
                  },
                  error: (updateErr) => {
                    console.error('Failed to update backend cart:', updateErr);
                  }
                });
              } else {
                console.log('No new books to update in backend');
                this.dataService.updateCart(backendCart);
                this.loginSuccess.emit(); 
                this.closeDialog();
              }
            },
            error: (fetchErr) => {
              console.error('Failed to fetch cart:', fetchErr);
            }
          });
        },
        error: (err) => {
          console.error('Login failed', err);
        }
      });
    }
  }

  mergeLocalIntoBackend(localCart: any[], backendCart: any[]): any[] {
    const updatedCart: any[] = [];
    localCart.forEach(localItem => {
      const existingItem = backendCart.find(item => item.bookId === localItem._id);
      if (existingItem) {
        existingItem.quantity += localItem.quantity;
      } else {
        updatedCart.push(localItem);
      }
    });
    return updatedCart;
  }

  closeDialog() {
    console.log('Closing login dialog');
    if (this.dialogRef) {  
      this.dialogRef.close();
    }
  }
}
