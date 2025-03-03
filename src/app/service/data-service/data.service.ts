import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  private wishlist = new BehaviorSubject<any[]>([]);
  wishlist$ = this.wishlist.asObservable();

  constructor(private authService: AuthService) {
    // this.loadWishlistFromLocalStorage();
  }


  // private loadWishlistFromLocalStorage() {
  //   const savedWishlist = localStorage.getItem('wishlistItems');

  //   if (savedWishlist) {
  //     this.wishlist.next(JSON.parse(savedWishlist));   
  //   }
  // }

  // private saveWishlistToLocal(wishlist: any[]) {
  //   localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
  // }

  addToCart(book: any) {
    const currentCart = this.getCartItems();
    console.log(currentCart);
    let cartBook = currentCart.find(item => item.bookId === book._id);

    if (!cartBook) {
      const updatedCart = [...currentCart, {
        ...book,
        bookId: book._id,
        quantity: 1
      }];

      this.cartItems.next(updatedCart);
    }
  }

  getCartItems() {
    return this.cartItems.getValue();
  }

  removeFromCart(bookId: string) {
    const updatedCart = this.getCartItems().filter(item => item.bookId !== bookId);
    this.cartItems.next(updatedCart);
  }

  updateCart(updatedCart: any[]) {
    this.cartItems.next(updatedCart);
  }

  updateQuantity(bookId: string, change: number) {
    let updatedCart = this.getCartItems().map(item => {
      if (item.bookId === bookId) {
        return { ...item, quantity: item.quantity + change };
      }
      return item;
    }).filter(item => item.quantity > 0);

    this.updateCart(updatedCart);
  }

  addToWishlist(book: any) {

    const currentWishlist = this.wishlist.getValue(); // backend wali books ani chahiye
    console.log("currecnt wishlist: ", currentWishlist);

    if (!currentWishlist.some(item => item.bookId === book._id)) {
      const newWishlist = [...currentWishlist, { ...book, bookId: book._id }];
      this.wishlist.next(newWishlist);
      // this.saveWishlistToLocal(newWishlist);
    }

  }




  removeFromWishlist(bookId: string) {
    const updateWishlist = this.wishlist.getValue().filter(item => item.bookId !== bookId);
    this.wishlist.next(updateWishlist);
    // this.saveWishlistToLocal(updateWishlist);
  }

  isInWishlist(bookId: string): boolean {
    return this.wishlist.getValue().some(item => item.bookId === bookId);
  }

  setCartFromBackend(cartData: any[]) {
    this.cartItems.next([...cartData]);
  }

  getWishlistItems() {
    return this.wishlist.getValue();
  }

  updateWishlist(updatedWishlist: any[]) {
    console.log("updated wishlist -> ", updatedWishlist);
    this.wishlist.next(updatedWishlist);
    // this.saveWishlistToLocal(updatedWishlist);
  }
}
