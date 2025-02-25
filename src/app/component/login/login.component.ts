import { Component, EventEmitter, Optional, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user-service/user.service';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { DataService } from 'src/app/service/data-service/data.service';
import { CartService } from 'src/app/service/cart-service/cart.service';
import { WishlistService } from 'src/app/service/wishlist-service/wishlist.service';
import { MatDialogRef } from '@angular/material/dialog'; 
import { forkJoin } from 'rxjs';

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

          forkJoin({
            cart: this.cartService.fetchCartListApiCall(),
            wishlist: this.wishlistService.fetchWishListApiCall()
          }).subscribe({
            next: ({ cart, wishlist }) => {
              const backendCart = cart.data?.books || [];
              const localCart = this.dataService.getCartItems();
              let updatedCart = this.mergeLocalIntoBackend(localCart, backendCart);

              const backendWishlist = wishlist.data?.books || [];
              const localWishlist = this.dataService.getWishlistItems();
              let updatedWishlist = this.mergeLocalIntoBackendWishlist(localWishlist, backendWishlist);

              const apiCalls = [];
              if (updatedCart.length > 0) {
                apiCalls.push(this.cartService.updateCartListApiCall(updatedCart));
              }
              if (updatedWishlist.length > 0) {
                apiCalls.push(this.wishlistService.updateWishListApiCall(updatedWishlist));
              }

              forkJoin(apiCalls).subscribe({
                next: () => {
                  console.log('Cart & Wishlist updated successfully');
                  this.dataService.updateCart([...backendCart, ...updatedCart]);
                  this.dataService.updateWishlist([...backendWishlist, ...updatedWishlist]);

                  localStorage.removeItem('cartItems');
                  localStorage.removeItem('wishlistItems');

                  this.loginSuccess.emit();
                  this.closeDialog();
                },
                error: (err) => console.error('Error updating cart/wishlist:', err)
              });
            },
            error: (fetchErr) => console.error('Failed to fetch cart/wishlist:', fetchErr)
          });
        },
        error: (err) => console.error('Login failed', err)
      });
    }
  }

  mergeLocalIntoBackend(localCart: any[], backendCart: any[]): any[] {
    const updatedCart: any[] = [];
    
    localCart.forEach(localItem => {
      const existingItem = backendCart.find(item => item.bookId === localItem._id);
      
      if (existingItem) {
        this.cartService.updateBookQuantityApiCall(existingItem.bookId, localItem.quantity).subscribe({
          next: () => {
            console.log(`Quantity updated for ${existingItem.bookId}`);
            this.dataService.updateQuantity(existingItem.bookId, localItem.quantity);
          },
          error: (err) => console.error(`Failed to update quantity for ${existingItem.bookId}:`, err)
        });
      } else {
        updatedCart.push(localItem);
      }
    });
  
    return updatedCart;
  }

  mergeLocalIntoBackendWishlist(localWishlist: any[], backendWishlist: any[]): any[] {
    const updatedWishlist: any[] = [];

    localWishlist.forEach(localItem => {
      const existsInBackend = backendWishlist.some(book => book.bookId === localItem._id);

      if (!existsInBackend) {
        updatedWishlist.push(localItem);
      }
    });

    return updatedWishlist;
  }

  closeDialog() {
    console.log('Closing login dialog');
    if (this.dialogRef) {  
      this.dialogRef.close();
    }
  }
}