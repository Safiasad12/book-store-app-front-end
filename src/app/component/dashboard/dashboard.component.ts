import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CartService } from 'src/app/service/cart-service/cart.service';
import { DataService } from 'src/app/service/data-service/data.service';
import { LoginComponent } from '../login/login.component';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { WishlistService } from 'src/app/service/wishlist-service/wishlist.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {


  constructor(private router: Router, 
    private cartService: CartService, 
    private wishlistService: WishlistService,
    private dataService: DataService, 
    public authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.fetchCartFromBackend();
      this.fetchWishlistFromBackend();
    }
  }


  fetchCartFromBackend() {
    this.cartService.fetchCartListApiCall().subscribe({
      next: (cartRes) => {
        this.dataService.setCartFromBackend(cartRes.data?.books || []);
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


  handleDashBoardBtnClick(action: string) {
    if (action === "cart") {
      this.router.navigate(['/dashboard/cart']);
    }
    if (action === "book") {
      this.router.navigate(['/dashboard/books']);
    }
  }

  handleLogOutBtnClick() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  navigateToWishlist() {
    this.router.navigate(['/dashboard/wishlist']);
  }


  openLoginDialog() {
    this.dialog.open(LoginComponent, {
      width: '750px'
    });
  }
}




