import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private httpService: HttpService) { }


  addToWishListApiCall(id: string){
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.httpService.postApiCall(`http://localhost:3000/api/v1/wishlist/${id}`, {}, headers);
   
  }

    fetchWishListApiCall(): Observable<{ data: { books: any[] } }> {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      return this.httpService.getApiCall(`http://localhost:3000/api/v1/wishlist/`, headers);
    }

    deleteBookFromWishListApiCall(id: string) {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      return this.httpService.deleteApiCall(`http://localhost:3000/api/v1/wishlist/${id}`, headers);
    }
}
 