import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpService: HttpService) { }


  fetchCartListApiCall(): Observable<{ data: { books: any[] } }>{
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.httpService.getApiCall(`http://localhost:3000/api/v1/cart/`, headers)
  }
}


