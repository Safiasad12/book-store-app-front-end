import { Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { BookService } from 'src/app/service/book-service/book.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/service/data-service/data.service';
import { AuthService } from 'src/app/service/auth-service/auth.service'; 
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from 'src/app/service/cart-service/cart.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  book: any = {};  
  bookId: string | null = null;
  bookInCart: any = null;
  inWishlist: boolean = false;
  outOfStock: boolean = false;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private cartService: CartService, 
    private authService: AuthService, 
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.bookId = params.get('id');
      if (this.bookId) {
        this.fetchBookDetails(this.bookId);
      }
    });

    this.dataService.cartItems$.pipe(takeUntil(this.unsubscribe$)).subscribe(cartItems => {
      this.bookInCart = cartItems.find(item => item.bookId === this.bookId) || null;
      this.cdRef.detectChanges();
    });

    this.dataService.wishlist$.pipe(takeUntil(this.unsubscribe$)).subscribe(wishlist => {
      this.inWishlist = wishlist.some(item => item._id === this.bookId);
      this.cdRef.detectChanges();
    });
  }

  private fetchBookDetails(bookId: string) {
    this.bookService.fetchBookByIdApiCall(bookId).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (res: any) => {
        this.book = res.data || {};
        this.outOfStock = this.book.quantity === 0;
        this.inWishlist = this.dataService.isInWishlist(this.book._id);
        this.cdRef.detectChanges();
      },
      error: (err) => console.error("Error fetching book details:", err)
    });
  }

  addToCart() {
    if (this.book && !this.outOfStock) {
      if (this.authService.isLoggedIn()) {
       
        const updatedCart = [{ _id: this.book._id, quantity: 1 }]; 
  
        this.cartService.updateCartListApiCall(updatedCart).subscribe({
          next: (res: any) => {
            console.log("Added to cart:", res);
            this.dataService.addToCart(this.book); 
            this.cdRef.detectChanges();
          },
          error: (err) => console.error("Error adding to cart:", err)
        });
  
      } else {
        this.dataService.addToCart(this.book);
        this.cdRef.detectChanges();
      }
    }
  }
  
  

  toggleWishlist() {
    if (this.book) {
      this.inWishlist = !this.inWishlist;
      if (this.inWishlist) {
        this.dataService.addToWishlist(this.book);
      } else {
        this.dataService.removeFromWishlist(this.book._id);
      }
      this.cdRef.detectChanges();
    }
  }

  getCartQuantity(): number {
    return this.bookInCart ? this.bookInCart.quantity : 0;
  }

  updateQuantity(change: number) {
    if (this.bookId !== null) { 
      if (this.authService.isLoggedIn()) {
        this.cartService.updateBookQuantityApiCall(this.bookId, change).subscribe({
          next: (res: any) => {
            console.log("Quantity updated successfully:", res);
            this.dataService.updateQuantity(this.bookId as string, change); 
            this.cdRef.detectChanges();
          },
          error: (err) => console.error("Error updating quantity:", err)
        });
  
      } else {
        this.dataService.updateQuantity(this.bookId as string, change);
        this.cdRef.detectChanges();
      }
    } else {
      console.error("Error: bookId is null, cannot update quantity.");
    }
  }
  
  
  

  inCart(): boolean {
    return !!this.bookInCart;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
