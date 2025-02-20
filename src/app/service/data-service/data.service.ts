import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  private wishlist = new BehaviorSubject<any[]>([]);
  wishlist$ = this.wishlist.asObservable();


  addToCart(book: any) {
    const currentCart = this.cartItems.getValue();
    if (!currentCart.find(item => item._id === book._id)) {
      currentCart.push({ ...book });
      this.cartItems.next([...currentCart]);
    }
  }

  removeFromCart(bookId: string) {
    const updatedCart = this.cartItems.getValue().filter(item => item._id !== bookId);
    this.cartItems.next(updatedCart);
  }

  updateCart(updatedCart: any[]) {
    this.cartItems.next(updatedCart);
  }


  addToWishlist(book: any) {
    const currentWishlist = this.wishlist.getValue();
    if (!currentWishlist.find(item => item._id === book._id)) {
      currentWishlist.push({ ...book });
      this.wishlist.next([...currentWishlist]);
    }
  }

  

  removeFromWishlist(bookId: string) {
    const updateWishlist = this.wishlist.getValue().filter(item => item._id !== bookId);
    this.wishlist.next(updateWishlist);
  }
}


