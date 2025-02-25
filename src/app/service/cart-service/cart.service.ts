import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpService: HttpService) { }

  fetchCartListApiCall(): Observable<{ data: { books: any[] } }> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.httpService.getApiCall(`http://localhost:3000/api/v1/cart/`, headers);
  }

  updateCartListApiCall(updatedCart: any[]): Observable<{ data: { books: any[] } }> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.httpService.postApiCall(`http://localhost:3000/api/v1/cart/`, { books: updatedCart }, headers);
  }

  deleteCartItemApiCall(itemId: string): Observable<any> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.httpService.deleteApiCall(`http://localhost:3000/api/v1/cart/${itemId}`, headers);
  }

  updateBookQuantityApiCall(bookId: string, change: number): Observable<any> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.httpService.putApiCall(`http://localhost:3000/api/v1/cart/${bookId}`, { "quantityChange": change}, headers);
  }
  
}
