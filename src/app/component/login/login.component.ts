import { Component } from '@angular/core';
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
    private dialogRef: MatDialogRef<LoginComponent> 
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
  
              // ✅ Merge both carts
              console.log("this is local cart : ");
              console.log(localCart);
              console.log("---------");
              console.log("this is backendCart");
              console.log(backendCart);
              const mergedCart = this.mergeCarts(localCart, backendCart);
              this.cartService.updateCartListApiCall(mergedCart).subscribe(() => {
                console.log('Backend cart updated successfully');
             
            });
            this.dataService.updateCart(mergedCart);
            localStorage.removeItem('cartItems');
          },
            error: (err) => {
              console.error('Failed to fetch cart:', err);
              this.dataService.updateCart([]); 
            }
          });
          this.dialogRef.close(); 
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


  mergeCarts(localCart: any[], backendCart: any[]): any[] {
    const mergedCart = [...backendCart];
  
    localCart.forEach(localItem => {
      const existingItem = mergedCart.find(item => item.bookId === localItem._id);
      if (existingItem) {
        existingItem.quantity += localItem.quantity; // Increase quantity if book already exists
      } else {
        mergedCart.push(localItem); // Add new book
      }
    });
  
    return mergedCart;
  }
  
}