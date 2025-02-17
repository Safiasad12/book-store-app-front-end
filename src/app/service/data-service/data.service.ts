import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private selectedBookId = new BehaviorSubject<string | null>(null);
  selectedBookId$ = this.selectedBookId.asObservable();


  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  handleBookId(bookId: string) {
    this.selectedBookId.next(bookId);
  }


  addToCart(book: any) {
    const currentCart = this.cartItems.getValue();
    const existingItem = currentCart.find(item => item.id === book.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...book});
    }

    this.cartItems.next([...currentCart]);
  }

  removeFromCart(bookId: string) {
    const updatedCart = this.cartItems.getValue().filter(item => item.id !== bookId);
    this.cartItems.next(updatedCart);
  }

  updateCart(updatedCart: any[]) {
    this.cartItems.next(updatedCart);
  }

}
