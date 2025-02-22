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

  constructor() { 
    this.loadCartFromLocalStorage();
  } 

  private loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));   
    }
  }

  private saveCartToLocal(cart: any[]) {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }


  getCartItems() {
    return this.cartItems.getValue(); 
  }

  addToCart(book: any) {
    const currentCart = this.getCartItems();  
    if (!currentCart.find(item => item._id === book._id)) {
      currentCart.push({ ...book, quantity: 1 }); 
      this.cartItems.next([...currentCart]);
      this.saveCartToLocal(currentCart);
    }
  }

  removeFromCart(bookId: string) {
    const updatedCart = this.getCartItems().filter(item => item._id !== bookId);
    this.cartItems.next(updatedCart);
    this.saveCartToLocal(updatedCart);
  }

  updateCart(updatedCart: any[]) {
    this.cartItems.next(updatedCart);
    this.saveCartToLocal(updatedCart);
    console.log('updatedCart', updatedCart);
  }

  updateQuantity(bookId: string, change: number) {
    let updatedCart = this.getCartItems().map(item => {
      if (item._id === bookId) {
        return { ...item, quantity: item.quantity + change };
      }
      return item;
    }).filter(item => item.quantity > 0); 

    this.updateCart(updatedCart);
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
