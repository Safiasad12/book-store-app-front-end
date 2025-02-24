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
    this.loadWishlistFromLocalStorage();
  } 

  private loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));   
    }
  }

  private loadWishlistFromLocalStorage() {
    const savedWishlist = localStorage.getItem('wishlistItems');
    if (savedWishlist) {
      this.wishlist.next(JSON.parse(savedWishlist));   
    }
  }

  private saveCartToLocal(cart: any[]) {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }

  private saveWishlistToLocal(wishlist: any[]) {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
  }

  addToCart(book: any) {
    const currentCart = this.getCartItems();
    let cartBook = currentCart.find(item => item.bookId === book._id);

    if (!cartBook) {
        const updatedCart = [...currentCart, { 
            ...book, 
            bookId: book._id,  
            quantity: 1 
        }];

        this.cartItems.next(updatedCart);  
        this.saveCartToLocal(updatedCart);
    }
  }

  getCartItems() {
    return this.cartItems.getValue(); 
  }

  removeFromCart(bookId: string) {
    const updatedCart = this.getCartItems().filter(item => item.bookId !== bookId);
    this.cartItems.next(updatedCart);
    this.saveCartToLocal(updatedCart);
  }

  updateCart(updatedCart: any[]) {
    this.cartItems.next(updatedCart);
    this.saveCartToLocal(updatedCart);
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
    const currentWishlist = this.wishlist.getValue();
    
    if (!currentWishlist.some(item => item.bookId === book._id)) {
      const newWishlist = [...currentWishlist, { ...book, bookId: book._id }];
      this.wishlist.next(newWishlist);
      this.saveWishlistToLocal(newWishlist);
    }
  }

  removeFromWishlist(bookId: string) {
    const updateWishlist = this.wishlist.getValue().filter(item => item.bookId !== bookId);
    this.wishlist.next(updateWishlist);
    this.saveWishlistToLocal(updateWishlist);
  }

  isInWishlist(bookId: string): boolean {
    return this.wishlist.getValue().some(item => item.bookId === bookId);
  }

  setCartFromBackend(cartData: any[]) {
    this.cartItems.next([...cartData]);  
    this.saveCartToLocal(cartData);
  }

  getWishlistItems() {
    return this.wishlist.getValue();
  }

  updateWishlist(updatedWishlist: any[]) {
    this.wishlist.next(updatedWishlist);
    this.saveWishlistToLocal(updatedWishlist);
  }
}
