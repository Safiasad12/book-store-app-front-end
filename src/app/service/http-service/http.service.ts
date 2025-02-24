import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  getApiCall<T>(url: string, header: any = {}): Observable<T> {
    return this.httpClient.get<T>(url, { headers: header || {} });
  }

  postApiCall<T>(url: string, data: any, header: any = {}): Observable<T> {
    return this.httpClient.post<T>(url, data, { headers: header || {} });
  }

  deleteApiCall<T>(url: string, header: any = {}): Observable<T> {
    return this.httpClient.delete<T>(url, { headers: header || {} });
  }

  putApiCall<T>(url: string, data: any, header: any = {}): Observable<T> {
    return this.httpClient.put<T>(url, data, { headers: header || {} });
  }
}
