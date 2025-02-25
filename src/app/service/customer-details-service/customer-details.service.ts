import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http-service/http.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerDetailsService {
  private baseUrl = 'http://localhost:3000/api/v1//customer-details'; 

  constructor(private httpService: HttpService) {}

  addNewAddress(data: { address: string; city: string; state: string, type: string }): Observable<any> {
    const url = `${this.baseUrl}/add-address`;
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }; 
    return this.httpService.postApiCall(url, data, headers);
  }

  getCustomerDetails(): Observable<any> {
    const url = `${this.baseUrl}`;
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }; 
    return this.httpService.getApiCall(url, headers);
  }

  updateAddress(data: { addressId: string; address: string; city: string; state: string; type: string }): Observable<any> {
    const url = `${this.baseUrl}/update-address`;
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }; 
    return this.httpService.putApiCall(url, data, headers);
  }
}
