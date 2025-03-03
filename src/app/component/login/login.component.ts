import { Component, EventEmitter, Optional, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user-service/user.service';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { DataService } from 'src/app/service/data-service/data.service';
import { CartService } from 'src/app/service/cart-service/cart.service';
import { MatDialogRef } from '@angular/material/dialog';
import { WishlistService } from 'src/app/service/wishlist-service/wishlist.service';

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
    private wishlistService: WishlistService,
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

              const localCart = this.dataService.getCartItems();
              const localWishlist = this.dataService.getWishlistItems();
              console.log("local wishlist: ", localWishlist);

              if (localCart.length > 0) {
                this.cartService.updateCartListApiCall(localCart).subscribe({
                  next: (res) => {
                    console.log('Cart updated successfully');
                    this.dataService.updateCart(res.data.books);

                    this.loginSuccess.emit();
                    this.closeDialog();
                  },
                  error: (err) => console.error('Error updating cart:', err)
                });
              } else {
                this.fetchCartFromBackend();
                this.loginSuccess.emit();
                this.closeDialog();
              }


            this.fetchWishlistFromBackend();

            },
            error: (fetchErr) => {
              console.error('Failed to fetch cart:', fetchErr);
            } 
          });
          
    }
  }


  fetchCartFromBackend() {
    this.cartService.fetchCartListApiCall().subscribe({
      next: (cartRes) => {
        this.dataService.updateCart(cartRes.data?.books || []);
      },
      error: (err) => {
        console.error('Failed to fetch cart:', err);
      }
    });
  }


  fetchWishlistFromBackend() {
    this.wishlistService.fetchWishListApiCall().subscribe({
      next: (res) => {
        console.log("res=", res);
        if (res?.data?.books) {  
          this.dataService.updateWishlist(res.data.books);
        } else {
          console.error("Unexpected API response structure:", res);
        }
      },
      error: (error) => {
        console.error("Error fetching wishlist", error);
      }
    });
  }

  closeDialog() {
    console.log('Closing login dialog');
    if (this.dialogRef) {
      
      this.dialogRef.close();
    }
  }
}





